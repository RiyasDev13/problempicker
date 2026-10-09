import { useEffect, useRef, useState } from "react";
import DescriptionContent from "./DescriptionContent.jsx";
import { copyText } from "../utils/clipboard.js";
import {
  createAiPrompt,
  createProblemStatement,
  createStatementAndPrompt,
} from "../utils/aiPrompt.js";

export default function DetailDrawer({
  problem,
  isSaved,
  onClose,
  onToggleSaved,
  restoreFocusRef,
}) {
  const drawerRef = useRef(null);
  const [copyMessage, setCopyMessage] = useState("");

  const copyContent = async (content, successMessage, errorMessage) => {
    try {
      await copyText(content);
      setCopyMessage(successMessage);
    } catch (error) {
      console.error("Could not copy project content.", error);
      setCopyMessage(errorMessage);
    }
  };

  useEffect(() => {
    const previousFocus = document.activeElement;
    const focusReturnTarget = restoreFocusRef?.current;
    const drawer = drawerRef.current;
    const focusableSelector =
      "a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex='-1'])";
    const focusFirst = () => drawer?.querySelector(focusableSelector)?.focus();
    focusFirst();

    const trapFocus = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !drawer) return;
      const focusable = [...drawer.querySelectorAll(focusableSelector)];
      if (!focusable.length) {
        event.preventDefault();
        drawer.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!drawer.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);

    return () => {
      document.removeEventListener("keydown", trapFocus);
      const returnTarget = focusReturnTarget?.isConnected ? focusReturnTarget : previousFocus;
      if (returnTarget?.isConnected) returnTarget.focus();
    };
  }, [onClose, restoreFocusRef]);

  return (
    <div className="scrim" onClick={onClose}>
      <article
        ref={drawerRef}
        className="drawer"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="problem-title"
        tabIndex="-1"
      >
        <div className="top">
          <span className={`meta ${problem.type}`}>{problem.type}</span>
          <button className="link" onClick={onClose}>
            Close
          </button>
        </div>
        <h3 id="problem-title">{problem.title}</h3>
        <p className="meta">
          {problem.type} · {problem.cat}
          {problem.domain && problem.domain !== problem.cat ? ` (${problem.domain})` : ""}
        </p>
        <div className="chips">
          {problem.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
        <h4>Description</h4>
        <DescriptionContent description={problem.desc} />
        <section className="ai-prompt" aria-labelledby="ai-prompt-title">
          <h4 id="ai-prompt-title">Want help planning this project?</h4>
          <p>
            Copy this prompt with the problem statement and paste it into ChatGPT, Claude, or
            another AI assistant for a tailored project plan.
          </p>
          <pre>{createAiPrompt(problem)}</pre>
        </section>
        <div className="acts">
          <button className="solid" onClick={onToggleSaved}>
            {isSaved ? "Remove from shortlist" : "Save to shortlist"}
          </button>
          <button
            className="ghost"
            onClick={() =>
              copyContent(
                createProblemStatement(problem),
                "Problem statement and description copied.",
                "Could not access the clipboard. Select and copy the statement manually.",
              )
            }
          >
            Copy full statement
          </button>
          <button
            className="ghost"
            onClick={() =>
              copyContent(
                createAiPrompt(problem),
                "AI planning prompt copied.",
                "Could not access the clipboard. Select and copy the prompt manually.",
              )
            }
          >
            Copy AI prompt
          </button>
          <button
            className="ghost"
            onClick={() =>
              copyContent(
                createStatementAndPrompt(problem),
                "Problem statement and AI prompt copied.",
                "Could not access the clipboard. Select and copy the content manually.",
              )
            }
          >
            Copy both
          </button>
        </div>
        {copyMessage && (
          <p className="copy-status" role="status">
            {copyMessage}
          </p>
        )}
      </article>
    </div>
  );
}
