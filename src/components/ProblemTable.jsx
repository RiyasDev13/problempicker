import { useState } from "react";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function getPageNumbers(currentPage, pageCount) {
  if (pageCount <= 5) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const pages = new Set([1, pageCount, currentPage - 1, currentPage, currentPage + 1]);
  return [...pages].filter((page) => page >= 1 && page <= pageCount).sort((a, b) => a - b);
}

export default function ProblemTable({
  problems,
  displayNumberById,
  saved,
  view,
  compareSelection,
  resetKey,
  onToggleCompare,
  onOpen,
  onToggleSaved,
}) {
  const [pagination, setPagination] = useState({ key: resetKey, page: 1, pageSize: 10 });
  const pageSize = pagination.pageSize;
  const pageCount = Math.max(1, Math.ceil(problems.length / pageSize));
  const page = Math.min(pagination.key === resetKey ? pagination.page : 1, pageCount);
  const startIndex = (page - 1) * pageSize;
  const pageProblems = problems.slice(startIndex, startIndex + pageSize);
  const pageNumbers = getPageNumbers(page, pageCount);

  const setPage = (nextPage) => {
    setPagination((current) => ({ ...current, key: resetKey, page: nextPage }));
  };

  return (
    <section className="problem-table-section" aria-label="Problem statements in table view">
      <div className="problem-table-controls">
        <label>
          Show
          <select
            value={pageSize}
            onChange={(event) =>
              setPagination({
                key: resetKey,
                page: 1,
                pageSize: Number(event.target.value),
              })
            }
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          entries
        </label>
        <span>
          {problems.length
            ? `Showing ${startIndex + 1}–${Math.min(startIndex + pageSize, problems.length)} of ${problems.length}`
            : "No problem statements"}
        </span>
      </div>

      <div className="problem-table-scroll">
        <table className="problem-table">
          <caption className="sr-only">Problem statements and project details</caption>
          <thead>
            <tr>
              <th scope="col">S.No.</th>
              <th scope="col">Problem Statement Title</th>
              <th scope="col">Category</th>
              <th scope="col">Type</th>
              <th scope="col">Difficulty</th>
              <th scope="col">Estimated Time</th>
              <th scope="col">Details</th>
              <th scope="col">Shortlist</th>
            </tr>
          </thead>
          <tbody>
            {pageProblems.map((problem) => (
              <tr key={problem.id}>
                <td>{displayNumberById.get(problem.id)}</td>
                <td>
                  <button
                    className="problem-table-title"
                    type="button"
                    onClick={(event) => onOpen(problem, event.currentTarget)}
                  >
                    {problem.title}
                  </button>
                  <p className="problem-table-description">
                    {problem.desc.slice(0, 180)}
                    {problem.desc.length > 180 ? "…" : ""}
                  </p>
                </td>
                <td>{problem.cat}</td>
                <td>{problem.type}</td>
                <td>{problem.difficulty}</td>
                <td>
                  {problem.weeksToBuild[0]}–{problem.weeksToBuild[1]} weeks
                </td>
                <td>
                  <button
                    className="problem-table-open"
                    type="button"
                    onClick={(event) => onOpen(problem, event.currentTarget)}
                  >
                    View
                  </button>
                </td>
                <td className="problem-table-actions">
                  {view === "saved" && (
                    <label className="problem-table-compare">
                      <input
                        type="checkbox"
                        checked={compareSelection.includes(problem.id)}
                        disabled={
                          compareSelection.length >= 3 && !compareSelection.includes(problem.id)
                        }
                        onChange={() => onToggleCompare(problem.id)}
                        aria-label={`Select ${problem.title} for comparison`}
                      />
                      Compare
                    </label>
                  )}
                  <button
                    className="problem-table-save"
                    type="button"
                    onClick={() => onToggleSaved(problem.id)}
                    aria-pressed={saved.includes(problem.id)}
                  >
                    {saved.includes(problem.id) ? "Saved" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
            {!pageProblems.length && (
              <tr>
                <td className="problem-table-empty" colSpan={8}>
                  No problem statements match the current search and filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav className="problem-table-pagination" aria-label="Problem table pages">
        <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        {pageNumbers.map((pageNumber, index) => (
          <span className="problem-table-page-item" key={pageNumber}>
            {index > 0 && pageNumber - pageNumbers[index - 1] > 1 && (
              <span className="problem-table-ellipsis" aria-hidden="true">
                …
              </span>
            )}
            <button
              type="button"
              className={page === pageNumber ? "active" : ""}
              aria-current={page === pageNumber ? "page" : undefined}
              aria-label={`Page ${pageNumber}`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          </span>
        ))}
        <button type="button" disabled={page === pageCount} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </nav>
    </section>
  );
}
