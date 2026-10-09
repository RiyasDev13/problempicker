import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Filters from "./components/Filters.jsx";
import ProblemList from "./components/ProblemList.jsx";
import DetailDrawer from "./components/DetailDrawer.jsx";
import ShortlistBar from "./components/ShortlistBar.jsx";
import CompareTable from "./components/CompareTable.jsx";
import FindMyMatch from "./components/FindMyMatch.jsx";
import ProblemToolbar from "./components/ProblemToolbar.jsx";
import HowToUse from "./components/HowToUse.jsx";
import { useFilters } from "./hooks/useFilters.js";
import { useSavedProblems } from "./hooks/useSavedProblems.js";
import { createProblemSlugs } from "./utils/slugs.js";
import { filterProblems } from "./utils/problemFilters.js";
import { useTheme } from "./hooks/useTheme.js";

const PAGE_SIZE = 40;

export default function App() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedView, setView] = useState("browse");
  const [compareSelection, setCompareSelection] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [pageState, setPageState] = useState({ key: "", limit: PAGE_SIZE });
  const [listMode, setListMode] = useState("cards");
  const navigate = useNavigate();
  const location = useLocation();
  const slug = location.pathname.match(/^\/problem\/([^/]+)\/?$/)?.[1];
  const triggerElement = useRef(null);
  const { saved, toggleSaved, setSaved } = useSavedProblems();
  const filters = useFilters();
  const { theme, toggleTheme } = useTheme();

  const { slugById, problemBySlug } = useMemo(() => createProblemSlugs(problems), [problems]);
  const displayNumberById = useMemo(
    () => new Map(problems.map((problem, index) => [problem.id, index + 1])),
    [problems],
  );
  const openProblem = slug ? problemBySlug.get(slug) : null;
  const selectedTags = useMemo(() => JSON.parse(filters.tagKey), [filters.tagKey]);
  const sharedParam = new URLSearchParams(location.search).get("shortlist") || "";
  const sharedSlugs = useMemo(
    () => (sharedParam ? sharedParam.split(",").filter(Boolean) : null),
    [sharedParam],
  );
  const sharedProblems = useMemo(
    () => sharedSlugs?.map((sharedSlug) => problemBySlug.get(sharedSlug)).filter(Boolean) ?? null,
    [sharedSlugs, problemBySlug],
  );
  const view = sharedSlugs ? "saved" : selectedView;
  const pageKey = JSON.stringify([
    filters.deferredQuery,
    filters.type,
    filters.category,
    filters.tagKey,
    filters.difficulty,
    filters.sort,
    view,
  ]);
  const limit = pageState.key === pageKey ? pageState.limit : PAGE_SIZE;

  useEffect(() => {
    import("./data/problems.json")
      .then((module) => setProblems(module.default))
      .catch((error) => {
        console.error("Could not load problem statements.", error);
        setLoadError("Problem statements could not be loaded. Refresh to try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const counts = new Map();
    problems
      .filter((problem) => filters.type === "All" || problem.type === filters.type)
      .forEach((problem) => counts.set(problem.cat, (counts.get(problem.cat) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [problems, filters.type]);

  const availableTags = useMemo(
    () => [...new Set(problems.flatMap((problem) => problem.tags))].sort(),
    [problems],
  );

  const savedProblems = useMemo(
    () => problems.filter((problem) => saved.includes(problem.id)),
    [problems, saved],
  );
  const shortlistProblems = sharedProblems || savedProblems;

  const visibleProblems = useMemo(() => {
    const source =
      view === "saved"
        ? shortlistProblems
        : problems.filter((problem) => filters.type === "All" || problem.type === filters.type);

    const filtered = filterProblems(source, {
      type: view === "saved" ? "All" : filters.type,
      category: filters.category,
      difficulty: filters.difficulty,
      tags: selectedTags,
      query: filters.deferredQuery,
    });
    const difficultyOrder = { Beginner: 0, Intermediate: 1, Advanced: 2 };
    if (filters.sort === "Title")
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    if (filters.sort === "Difficulty") {
      return [...filtered].sort(
        (a, b) =>
          difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty] ||
          a.title.localeCompare(b.title),
      );
    }
    return filtered;
  }, [
    problems,
    shortlistProblems,
    view,
    filters.type,
    filters.category,
    selectedTags,
    filters.deferredQuery,
    filters.difficulty,
    filters.sort,
  ]);

  const comparedProblems = shortlistProblems.filter((problem) =>
    compareSelection.includes(problem.id),
  );

  const toggleCompare = useCallback((id) => {
    setCompareSelection((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      return current.length < 3 ? [...current, id] : current;
    });
  }, []);
  const toggleSavedProblem = useCallback(
    (id) => {
      if (saved.includes(id)) {
        setCompareSelection((current) => current.filter((item) => item !== id));
      }
      toggleSaved(id);
    },
    [saved, toggleSaved],
  );

  const resetFilters = filters.reset;

  const pickRandom = useCallback(
    (trigger) => {
      if (visibleProblems.length) {
        const selected = visibleProblems[Math.floor(Math.random() * visibleProblems.length)];
        triggerElement.current = trigger;
        navigate(`/problem/${slugById.get(selected.id)}${location.search}`);
      }
    },
    [visibleProblems, navigate, slugById, location.search],
  );
  const showProblem = useCallback(
    (problem, trigger) => {
      triggerElement.current = trigger;
      navigate(`/problem/${slugById.get(problem.id)}${location.search}`);
    },
    [navigate, slugById, location.search],
  );
  const closeProblem = useCallback(
    () => navigate(`/${location.search}`, { replace: true }),
    [navigate, location.search],
  );
  const copyShortlistLink = () => {
    const url = new URL(window.location.href);
    url.pathname = location.pathname.replace(/^\/problem\/[^/]+\/?$/, "/");
    url.search = "";
    url.searchParams.set(
      "shortlist",
      shortlistProblems.map((problem) => slugById.get(problem.id)).join(","),
    );
    return url.toString();
  };
  const clearShortlist = () => {
    if (sharedSlugs) {
      const params = new URLSearchParams(location.search);
      params.delete("shortlist");
      navigate(`/${params.toString() ? `?${params}` : ""}`, { replace: true });
      setView("browse");
      return;
    }
    setSaved([]);
    setCompareSelection([]);
  };

  return (
    <div className={view === "saved" ? "app print-shortlist" : "app"}>
      <Header
        total={problems.length}
        softwareCount={problems.filter((problem) => problem.type === "Software").length}
        hardwareCount={problems.filter((problem) => problem.type === "Hardware").length}
        onPickRandom={pickRandom}
        hasProblems={visibleProblems.length > 0}
        loading={loading}
        loadError={loadError}
        theme={theme}
        onToggleTheme={toggleTheme}
        view={view}
        savedCount={shortlistProblems.length}
        onViewChange={setView}
      />

      <section
        className="library-toolbar"
        id="problems"
        aria-label="Search and filter the problem library"
      >
        <ProblemToolbar
          query={filters.query}
          category={filters.category}
          sort={filters.sort}
          categories={categories}
          onQueryChange={filters.setQuery}
          onCategoryChange={filters.setCategory}
          onSortChange={filters.setSort}
        />
        <Filters
          type={filters.type}
          difficulty={filters.difficulty}
          tags={filters.tags}
          availableTags={availableTags}
          onTypeChange={filters.setType}
          onDifficultyChange={filters.setDifficulty}
          onTagToggle={filters.toggleTag}
        />
      </section>
      <main className="library-content">
        {view === "browse" && <HowToUse />}
        {view === "browse" && (
          <FindMyMatch problems={problems} availableTags={availableTags} onOpen={showProblem} />
        )}
        <ShortlistBar
          view={view}
          savedCount={shortlistProblems.length}
          compareCount={compareSelection.length}
          compareOpen={compareOpen}
          onViewChange={setView}
          onCompareToggle={() => setCompareOpen((current) => !current)}
          onClear={clearShortlist}
          onCopyShare={copyShortlistLink}
          onPrint={() => window.print()}
          savedProblems={shortlistProblems}
        />
        {view === "saved" && <h2 className="print-heading">My shortlist</h2>}
        <div className="problem-list-toolbar">
          <p className="count">
            {visibleProblems.length.toLocaleString()}{" "}
            {visibleProblems.length === 1 ? "problem" : "problems"}
            {(filters.query ||
              filters.category !== "All" ||
              filters.difficulty !== "All" ||
              filters.sort !== "Default" ||
              filters.tags.length ||
              filters.type !== "All") && (
              <>
                {" "}
                ·{" "}
                <button className="link" onClick={resetFilters}>
                  Reset filters
                </button>
              </>
            )}
          </p>
          <div className="problem-list-controls">
            {view === "browse" && listMode === "cards" && (
              <div
                className="list-view-toggle card-type-toggle"
                role="group"
                aria-label="Filter cards by project type"
              >
                {[
                  ["All", "All types"],
                  ["Software", "Software"],
                  ["Hardware", "Hardware"],
                ].map(([type, label]) => (
                  <button
                    key={type}
                    type="button"
                    className={filters.type === type ? "active" : ""}
                    aria-pressed={filters.type === type}
                    onClick={() => filters.setType(type)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
            <div className="list-view-toggle" role="group" aria-label="Problem list layout">
              <button
                type="button"
                className={listMode === "cards" ? "active" : ""}
                aria-pressed={listMode === "cards"}
                onClick={() => setListMode("cards")}
              >
                Cards
              </button>
              <button
                type="button"
                className={listMode === "table" ? "active" : ""}
                aria-pressed={listMode === "table"}
                onClick={() => setListMode("table")}
              >
                Table View
              </button>
            </div>
          </div>
        </div>
        <p className="estimate-note">
          Difficulty and build-time estimates are rough guides, not official ratings.
        </p>
        <ProblemList
          problems={visibleProblems}
          displayNumberById={displayNumberById}
          listMode={listMode}
          resetKey={pageKey}
          total={visibleProblems.length}
          limit={limit}
          saved={saved}
          view={view}
          loading={loading}
          loadError={loadError}
          compareSelection={compareSelection}
          onToggleCompare={toggleCompare}
          onOpen={showProblem}
          onToggleSaved={toggleSavedProblem}
          onShowMore={() =>
            setPageState((current) => ({
              key: pageKey,
              limit: (current.key === pageKey ? current.limit : PAGE_SIZE) + PAGE_SIZE,
            }))
          }
        />
        {view === "saved" && compareOpen && <CompareTable problems={comparedProblems} />}
      </main>

      {openProblem && (
        <DetailDrawer
          problem={openProblem}
          isSaved={saved.includes(openProblem.id)}
          onClose={closeProblem}
          onToggleSaved={() => toggleSavedProblem(openProblem.id)}
          restoreFocusRef={triggerElement}
        />
      )}
    </div>
  );
}
