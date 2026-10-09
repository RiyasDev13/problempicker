import { useEffect, useRef, useState } from "react";

export default function Filters({
  type,
  difficulty,
  tags,
  availableTags,
  onTypeChange,
  onDifficultyChange,
  onTagToggle,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const activeCount = Number(type !== "All") + Number(difficulty !== "All") + tags.length;

  useEffect(() => {
    if (!open) return undefined;
    const panel = panelRef.current;
    const trigger = triggerRef.current;
    const firstControl = panel?.querySelector("button, select");
    firstControl?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const controls = [...panel.querySelectorAll("button:not(:disabled), select")];
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        className="filter-trigger"
        aria-expanded={open}
        aria-controls="filter-drawer"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">☷</span> Filters{activeCount ? ` · ${activeCount}` : ""}
      </button>
      {open && (
        <div className="filter-overlay" onClick={() => setOpen(false)}>
          <aside
            ref={panelRef}
            className="filter-drawer"
            id="filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-drawer-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="filter-drawer-heading">
              <div>
                <span className="eyebrow">MAKE IT YOURS</span>
                <h2 id="filter-drawer-title">More filters</h2>
              </div>
              <button
                className="filter-close"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
              >
                ×
              </button>
            </div>
            <fieldset>
              <legend>Project type</legend>
              <div className="filter-options">
                {["All", "Software", "Hardware"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={type === option ? "filter-option selected" : "filter-option"}
                    aria-pressed={type === option}
                    onClick={() => onTypeChange(option)}
                  >
                    {option === "All" ? "Any type" : option}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="drawer-field">
              Difficulty
              <select
                aria-label="Filter by difficulty"
                value={difficulty}
                onChange={(event) => onDifficultyChange(event.target.value)}
              >
                {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                  <option key={level} value={level}>
                    {level === "All" ? "Any difficulty" : level}
                  </option>
                ))}
              </select>
            </label>
            <fieldset>
              <legend>Skills you want to use</legend>
              <div className="drawer-skills">
                {availableTags.map((tag) => (
                  <label className="skill-option" key={tag}>
                    <input
                      type="checkbox"
                      checked={tags.includes(tag)}
                      onChange={() => onTagToggle(tag)}
                    />
                    <span>{tag}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="filter-done" onClick={() => setOpen(false)}>
              Show matching problems
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
