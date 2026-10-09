export function createProblemSlugs(problems) {
  const slugById = new Map();
  const problemBySlug = new Map();
  const counts = new Map();

  problems.forEach((problem) => {
    const base =
      problem.title
        .normalize("NFKD")
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-") || "problem";
    const occurrence = (counts.get(base) || 0) + 1;
    counts.set(base, occurrence);
    const slug = occurrence === 1 ? base : `${base}-${occurrence}`;
    slugById.set(problem.id, slug);
    problemBySlug.set(slug, problem);
  });

  return { slugById, problemBySlug };
}
