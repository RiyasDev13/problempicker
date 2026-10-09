const steps = [
  {
    number: "01",
    title: "Choose a category",
    description:
      "Search by keyword to find words in titles or descriptions. Filter the list by project type, topic, or skill.",
  },
  {
    number: "02",
    title: "Get optional recommendations",
    description:
      "Get a guided match based on your year, team size, project type, and skills. This is a recommender, not another keyword search.",
  },
  {
    number: "03",
    title: "Read the full statement",
    description: "Open any result to review its complete description before choosing.",
  },
  {
    number: "04",
    title: "Copy and explore with AI",
    description:
      "Copy the statement, the project-planning prompt, or both. Paste them into ChatGPT, Claude, or another AI tool for more detailed guidance.",
  },
];

export default function HowToUse() {
  return (
    <section className="how-to-use" aria-labelledby="how-to-use-title">
      <div className="how-to-use-heading">
        <span className="eyebrow">A QUICK GUIDE</span>
        <h2 id="how-to-use-title">How to use Problem Picker</h2>
        <p>Go from exploring ideas to planning your next student project.</p>
      </div>
      <ol className="how-to-use-steps">
        {steps.map((step) => (
          <li key={step.number}>
            <span className="how-to-use-number">{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
