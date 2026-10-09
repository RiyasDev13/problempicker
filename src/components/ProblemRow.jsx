import { memo, useState } from "react";
import { copyText } from "../utils/clipboard.js";
import { createProblemStatement } from "../utils/aiPrompt.js";

function ProblemRow({
  problem,
  displayNumber,
  isSaved,
  onOpen,
  onToggleSaved,
  canCompare,
  compareSelected,
  compareDisabled,
  onToggleCompare,
}) {
  const [copyMessage, setCopyMessage] = useState("");
  const copyStatement = async () => {
    try {
      await copyText(createProblemStatement(problem));
      setCopyMessage("Problem statement copied.");
    } catch (error) {
      console.error("Could not copy the problem statement.", error);
      setCopyMessage("Could not access the clipboard. Open the statement to copy it manually.");
    }
  };

  return (
    <li className={`problem-card ${problem.type.toLowerCase()}`}>
      <div className="problem-card-inner">
        <div className="problem-card-header">
          <span className={`problem-pill ${problem.type.toLowerCase()}`}>{problem.type}</span>
          <span className="problem-id">#{displayNumber}</span>
        </div>

        <button className="problem-title" onClick={(event) => onOpen(problem, event.currentTarget)}>
          {problem.title}
        </button>

        <p className="problem-preview">
          {problem.desc.slice(0, 150)}
          {problem.desc.length > 150 ? "…" : ""}
        </p>

        <div className="problem-meta-row">
          <span>{problem.cat}</span>
          <span>{problem.difficulty}</span>
          <span>
            {problem.weeksToBuild[0]}–{problem.weeksToBuild[1]} weeks
          </span>
        </div>

        <div className="problem-tags">
          {problem.tags.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="problem-card-actions">
          {canCompare && (
            <label className="compare-select">
              <input
                type="checkbox"
                checked={compareSelected}
                disabled={compareDisabled}
                onChange={() => onToggleCompare(problem.id)}
                aria-label={`Select ${problem.title} for comparison`}
              />
              Compare
            </label>
          )}
          <button className="copy-problem" onClick={copyStatement}>
            Copy statement
          </button>
          <button
            className={isSaved ? "mark on" : "mark"}
            onClick={() => onToggleSaved(problem.id)}
            aria-pressed={isSaved}
            aria-label={isSaved ? "Remove from shortlist" : "Save to shortlist"}
          >
            <span aria-hidden="true">{isSaved ? "✓" : "+"}</span>
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
        {copyMessage && (
          <span className="copy-status" role="status">
            {copyMessage}
          </span>
        )}
      </div>
    </li>
  );
}

export default memo(ProblemRow);
