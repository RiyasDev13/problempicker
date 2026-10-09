export function filterProblems(problems, filters) {
  const words = filters.query.toLowerCase().split(/\s+/).filter(Boolean);
  return problems.filter(
    (problem) =>
      (filters.type === "All" || problem.type === filters.type) &&
      (filters.category === "All" || problem.cat === filters.category) &&
      (filters.difficulty === "All" || problem.difficulty === filters.difficulty) &&
      filters.tags.every((tag) => problem.tags.includes(tag)) &&
      words.every((word) => `${problem.title} ${problem.desc}`.toLowerCase().includes(word)),
  );
}
