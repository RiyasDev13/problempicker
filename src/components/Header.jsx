import { Link } from "react-router-dom";

export default function Header({
  total,
  softwareCount,
  hardwareCount,
  onPickRandom,
  hasProblems,
  loading,
  loadError,
  theme,
  onToggleTheme,
  view,
  savedCount,
  onViewChange,
}) {
  return (
    <header className="landing-header" id="top">
      <div className="topbar">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="Problem Picker home">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Problem Picker</span>
        </a>
        <nav className="top-nav" aria-label="Main navigation">
          <a href="#problems" onClick={() => onViewChange("browse")}>
            Browse
          </a>
          <a href="#student-helper" onClick={() => onViewChange("browse")}>
            Recommendations
          </a>
          <Link to="/about">About</Link>
        </nav>
        <button
          className={view === "saved" ? "nav-shortlist active" : "nav-shortlist"}
          onClick={() => onViewChange("saved")}
        >
          Shortlist <span>{savedCount}</span>
        </button>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span>
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </div>

      <div className="landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" /> THE PROJECT IDEA FINDER
          </span>
          <h1>Choose your next problem statement.</h1>
          <p className="hero-description">
            Skip the blank-page brainstorm. Explore real-world challenges and find a project your
            team is excited to build.
          </p>
          <div className="hero-actions">
            <a className="solid hero-cta" href="#problems" onClick={() => onViewChange("browse")}>
              Choose your problem statement <span aria-hidden="true">↓</span>
            </a>
            <button
              className="ghost hero-random"
              onClick={(event) => onPickRandom(event.currentTarget)}
              disabled={!hasProblems}
            >
              Pick one for me <span aria-hidden="true">↗</span>
            </button>
          </div>
          <div className="hero-stats" aria-label="Problem library summary">
            <div>
              <strong>{total ? total.toLocaleString() : "—"}</strong>
              <span>problem statements</span>
            </div>
            <div>
              <strong>{softwareCount.toLocaleString()}</strong>
              <span>software</span>
            </div>
            <div>
              <strong>{hardwareCount.toLocaleString()}</strong>
              <span>hardware</span>
            </div>
          </div>
          {(loadError || (loading && !total)) && (
            <p className="load-status" role={loadError ? "alert" : "status"}>
              {loadError || "Loading the problem library…"}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
