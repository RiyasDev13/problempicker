import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme.js";
import ContactForm from "./ContactForm.jsx";

const useCases = [
  {
    title: "Find a project idea",
    description:
      "Browse a collection of software and hardware problem statements when your team needs a clear starting point.",
  },
  {
    title: "Narrow the options",
    description:
      "Filter by project type, topic, skills, and difficulty to focus on ideas that suit your interests and experience.",
  },
  {
    title: "Plan with your team",
    description:
      "Compare and save promising ideas, then review the full statement together before choosing a direction.",
  },
  {
    title: "Get help exploring an idea",
    description:
      "Copy a statement and a prepared planning prompt into an AI assistant to ask for explanations, project steps, and questions to discuss.",
  },
];

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="about-page">
      <header className="about-topbar">
        <Link className="brand" to="/" aria-label="Problem Picker home">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span>Problem Picker</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link to="/">Browse</Link>
          <Link to="/#student-helper">Find a match</Link>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </nav>
      </header>

      <main className="about-content">
        <section className="about-hero">
          <span className="eyebrow">ABOUT PROBLEM PICKER</span>
          <h1>Good projects start with a problem worth solving.</h1>
          <p>
            Problem Picker helps students discover, understand, and compare project ideas from a
            large collection of software and hardware problem statements.
          </p>
        </section>

        <section className="about-section" aria-labelledby="about-why">
          <span className="eyebrow">WHY WE CREATED IT</span>
          <h2 id="about-why">Make the first step less overwhelming</h2>
          <p>
            Finding a suitable project can be difficult when there are hundreds of statements to
            review. Students need a simple way to explore ideas, see what each challenge involves,
            and choose something that fits their interests, skills, study year, and team.
          </p>
          <p>
            Problem Picker brings those discovery tools together in one place. It is designed to
            help students move from “What should we build?” to a shortlist they can discuss and
            investigate further.
          </p>
        </section>

        <section className="about-section" aria-labelledby="about-use-cases">
          <span className="eyebrow">WHAT YOU CAN DO</span>
          <h2 id="about-use-cases">Ways students use Problem Picker</h2>
          <div className="about-use-cases">
            {useCases.map((useCase, index) => (
              <article className="about-use-case" key={useCase.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{useCase.title}</h3>
                <p>{useCase.description}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="about-note">
          <h2>Use AI as a project-planning assistant</h2>
          <p>
            The copyable prompt is a starting point for exploring an idea with tools such as ChatGPT
            or Claude. AI suggestions can be inaccurate or incomplete, so verify requirements with
            your instructor and use your own judgement. Problem Picker does not send your data to an
            AI service.
          </p>
        </aside>

        <ContactForm />

        <Link className="about-back-link" to="/">
          Browse problem statements <span aria-hidden="true">→</span>
        </Link>
      </main>
    </div>
  );
}
