export default function ProblemToolbar({
  query,
  category,
  sort,
  categories,
  onQueryChange,
  onCategoryChange,
  onSortChange,
}) {
  return (
    <div className="library-controls">
      <label className="library-search">
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <span className="sr-only">Keyword search in the problem library</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search titles or descriptions..."
          aria-label="Keyword search"
        />
      </label>
      <label className="toolbar-select">
        <span className="toolbar-select-icon" aria-hidden="true">
          ▤
        </span>
        <span className="sr-only">Filter by topic</span>
        <select
          aria-label="Filter by topic"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="All">All topics</option>
          {categories.map(([name, count]) => (
            <option key={name} value={name}>
              {name} ({count})
            </option>
          ))}
        </select>
      </label>
      <label className="toolbar-select sort-select">
        <span className="toolbar-select-icon" aria-hidden="true">
          ☷
        </span>
        <span className="sr-only">Sort problem statements</span>
        <select
          aria-label="Sort problem statements"
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="Default">Default order</option>
          <option value="Title">Title A–Z</option>
          <option value="Difficulty">Difficulty</option>
        </select>
      </label>
    </div>
  );
}
