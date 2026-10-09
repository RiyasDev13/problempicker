import { useState } from "react";
import { downloadShortlistCsv } from "../utils/csv.js";

export default function ShortlistBar({
  view,
  savedCount,
  compareCount,
  compareOpen,
  onViewChange,
  onCompareToggle,
  onClear,
  onCopyShare,
  onPrint,
  savedProblems,
}) {
  const [shareMessage, setShareMessage] = useState("");
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(onCopyShare());
      setShareMessage("Shareable shortlist link copied.");
    } catch (error) {
      console.error("Could not copy the shortlist link.", error);
      setShareMessage(
        "Could not access the clipboard. Copy the URL from your address bar instead.",
      );
    }
  };

  return (
    <div className="tabs">
      <button className={view === "browse" ? "on" : ""} onClick={() => onViewChange("browse")}>
        Browse
      </button>
      <button className={view === "saved" ? "on" : ""} onClick={() => onViewChange("saved")}>
        My shortlist ({savedCount})
      </button>
      <span className="grow" />
      {view === "saved" && savedCount > 0 && (
        <>
          <button className="link" onClick={() => downloadShortlistCsv(savedProblems)}>
            Download CSV
          </button>
          <button className="link" onClick={copyShareLink}>
            Copy shareable shortlist link
          </button>
          <button className="link" onClick={onPrint}>
            Print / Save as PDF
          </button>
          <button className="link" onClick={onCompareToggle} aria-expanded={compareOpen}>
            {compareOpen ? "Hide comparison" : `Compare (${compareCount}/3)`}
          </button>
          <button className="link" onClick={onClear}>
            Clear all
          </button>
        </>
      )}
      {shareMessage && (
        <span className="sr-only" role="status">
          {shareMessage}
        </span>
      )}
    </div>
  );
}
