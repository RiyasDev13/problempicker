export function createAiPrompt(problem) {
  return `Act as a supportive project mentor. Help me understand and plan this ${problem.type.toLowerCase()} project without making assumptions about requirements that are not stated.

Problem statement:
${problem.title}

Description:
${problem.desc}

Please:
1. Explain the problem and its users in simple language.
2. Identify the main goals, constraints, and any information that is missing.
3. Suggest a realistic minimum viable project and a step-by-step implementation plan.
4. Recommend suitable technologies and explain the trade-offs.
5. Describe a possible system design, important components, and how they fit together.
6. Suggest milestones, tests, a demo plan, and likely risks.
7. Ask me a few questions about my academic year, team size, skills, timeline, and available resources so you can tailor the guidance.

Keep the advice practical for a student project. Clearly label assumptions and do not invent facts.`;
}

export function createProblemStatement(problem) {
  return `PROBLEM STATEMENT
${problem.title}

DESCRIPTION
${problem.desc}`;
}

export function createStatementAndPrompt(problem) {
  return `${createProblemStatement(problem)}

AI PROJECT-PLANNING PROMPT
${createAiPrompt(problem)}`;
}
