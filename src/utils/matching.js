const difficultyRank = { Beginner: 0, Intermediate: 1, Advanced: 2 };

export function rankProblems(problems, preferences) {
  const selectedSkills = new Set(preferences.skills);
  const studyYear = Number(preferences.year);
  const teamSize = Number(preferences.teamSize);
  const expectedLevel = studyYear >= 4 ? 2 : studyYear === 3 ? 1 : 0;
  const preferredDuration =
    (studyYear >= 4 ? 12 : studyYear === 3 ? 8 : 6) + Math.max(0, teamSize - 2);

  const uniqueProblems = new Map();
  problems.forEach((problem) => {
    const key = `${problem.title.trim().toLocaleLowerCase()}|${problem.desc.trim().toLocaleLowerCase()}`;
    if (!uniqueProblems.has(key)) uniqueProblems.set(key, problem);
  });

  return [...uniqueProblems.values()]
    .map((problem, sourceOrder) => ({ problem, sourceOrder }))
    .filter(({ problem }) => preferences.type === "All" || problem.type === preferences.type)
    .map(({ problem, sourceOrder }) => {
      const overlap = problem.tags.filter((tag) => selectedSkills.has(tag)).length;
      const level = difficultyRank[problem.difficulty] ?? 1;
      const yearFit = 2 - Math.abs(level - expectedLevel);
      const buildTime = problem.weeksToBuild?.[1] ?? Number.POSITIVE_INFINITY;
      const durationFit = buildTime <= preferredDuration ? 1 : 0;
      return {
        problem,
        overlap,
        yearFit,
        durationFit,
        sourceOrder,
        score: overlap * 100 + yearFit * 5 + durationFit,
      };
    })
    .filter(({ overlap }) => selectedSkills.size === 0 || overlap > 0)
    .sort((a, b) => b.score - a.score || a.sourceOrder - b.sourceOrder);
}
