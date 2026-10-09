import { useMemo } from "react";
import ProblemRow from "./ProblemRow.jsx";
import ProblemTable from "./ProblemTable.jsx";

export default function ProblemList({
  problems,
  displayNumberById,
  listMode,
  resetKey,
  total,
  limit,
  saved,
  view,
  loading,
  loadError,
  compareSelection,
  onToggleCompare,
  onOpen,
  onToggleSaved,
  onShowMore,
}) {
  const groups = useMemo(() => {
    const byCategory = new Map();
    problems.slice(0, limit).forEach((problem) => {
      if (!byCategory.has(problem.cat)) byCategory.set(problem.cat, []);
      byCategory.get(problem.cat).push(problem);
    });
    return [...byCategory.entries()];
  }, [problems, limit]);

  return (
    <>
      {loading && (
        <div
          className="problem-grid loading-grid"
          aria-label="Loading problem statements"
          aria-busy="true"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <div className="problem-skeleton" key={index} />
          ))}
        </div>
      )}
      {loadError && (
        <div className="empty" role="alert">
          {loadError}
        </div>
      )}
      {!loading && !loadError && (
        <>
          {total === 0 && (
            <div className="empty">
              {view === "saved"
                ? "Nothing saved yet. Save a problem to start your shortlist."
                : "No problems match. Try fewer keywords or reset the filters."}
            </div>
          )}
          {total > 0 && listMode === "table" && (
            <ProblemTable
              problems={problems}
              displayNumberById={displayNumberById}
              saved={saved}
              view={view}
              compareSelection={compareSelection}
              resetKey={resetKey}
              onToggleCompare={onToggleCompare}
              onOpen={onOpen}
              onToggleSaved={onToggleSaved}
            />
          )}
          {listMode === "cards" &&
            groups.map(([category, categoryProblems]) => (
              <section className="problem-group" key={category}>
                <div className="problem-group-heading">
                  <h2>{category}</h2>
                  <span>
                    {categoryProblems.length}{" "}
                    {categoryProblems.length === 1 ? "problem" : "problems"}
                  </span>
                </div>
                <ul className="problem-grid">
                  {categoryProblems.map((problem) => (
                    <ProblemRow
                      key={problem.id}
                      problem={problem}
                      displayNumber={displayNumberById.get(problem.id)}
                      isSaved={saved.includes(problem.id)}
                      canCompare={view === "saved"}
                      compareSelected={compareSelection.includes(problem.id)}
                      compareDisabled={
                        compareSelection.length >= 3 && !compareSelection.includes(problem.id)
                      }
                      onToggleCompare={onToggleCompare}
                      onOpen={onOpen}
                      onToggleSaved={onToggleSaved}
                    />
                  ))}
                </ul>
              </section>
            ))}
          {listMode === "cards" && total > limit && (
            <button className="more" onClick={onShowMore}>
              Show {Math.min(40, total - limit)} more problems
            </button>
          )}
        </>
      )}
    </>
  );
}
