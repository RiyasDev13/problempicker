import { useState } from "react";
import { rankProblems } from "../utils/matching.js";

export default function FindMyMatch({ problems, availableTags, onOpen }) {
  const [year, setYear] = useState("1");
  const [teamSize, setTeamSize] = useState("2");
  const [type, setType] = useState("All");
  const [skills, setSkills] = useState([]);
  const [matches, setMatches] = useState(null);

  const toggleSkill = (skill) => {
    setSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill],
    );
  };

  const findMatches = (event) => {
    event.preventDefault();
    setMatches(rankProblems(problems, { year, teamSize, type, skills }).slice(0, 5));
  };

  const clearForm = () => {
    setYear("1");
    setTeamSize("2");
    setType("All");
    setSkills([]);
    setMatches(null);
  };

  return (
    <details className="student-helper" id="student-helper">
      <summary>
        <span className="match-summary-title">Get personalized recommendations</span>
        <span className="match-summary-hint">
          Optional guided match by study year, team size, and skills—not a keyword search.
        </span>
      </summary>
      <form onSubmit={findMatches}>
        <p className="match-intro">
          Use this if you want help choosing. For a specific word or topic, use the library search
          above instead.
        </p>
        <div className="helper-fields">
          <label>
            Year of study
            <select value={year} onChange={(event) => setYear(event.target.value)}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option value={value} key={value}>
                  {value}
                  {value === 1 ? "st" : value === 2 ? "nd" : value === 3 ? "rd" : "th"} year
                  {value === 5 ? "+" : ""}
                </option>
              ))}
            </select>
          </label>
          <label>
            Project type
            <select value={type} onChange={(event) => setType(event.target.value)}>
              <option value="All">Software or hardware</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
            </select>
          </label>
          <label>
            Team size
            <input
              type="number"
              min="1"
              max="10"
              value={teamSize}
              onChange={(event) => setTeamSize(event.target.value)}
            />
          </label>
        </div>
        <fieldset>
          <legend>Strongest languages or skills</legend>
          <div className="helper-skills">
            {availableTags.map((skill) => (
              <label key={skill}>
                <input
                  type="checkbox"
                  checked={skills.includes(skill)}
                  onChange={() => toggleSkill(skill)}
                />
                {skill}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="match-form-actions">
          <button className="solid" type="submit">
            Find projects
          </button>
          <button className="ghost" type="button" onClick={clearForm}>
            Clear
          </button>
        </div>
        <p className="meta">
          Your answers stay in this browser. Recommendations are ranked by skill overlap, your study
          year, difficulty, and estimated build time. Exact duplicate statements are removed from
          the results.
        </p>
        {matches && (
          <div className="match-results" aria-live="polite">
            <div className="match-results-heading">
              <div>
                <h3>{matches.length ? "Recommended for you" : "No matches found"}</h3>
                {matches.length > 0 && (
                  <p>
                    Top {matches.length} {matches.length === 1 ? "idea" : "ideas"} for your {year}
                    {year === "1" ? "st" : year === "2" ? "nd" : year === "3" ? "rd" : "th"} year
                    selection and team of {teamSize}
                  </p>
                )}
              </div>
            </div>
            {matches.length ? (
              <ol className="match-results-list">
                {matches.map(({ problem, overlap }, index) => (
                  <li className="match-result-card" key={problem.id}>
                    <span className="match-result-rank" aria-label={`Recommendation ${index + 1}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="match-result-content">
                      <div className="match-result-topline">
                        <span className={`problem-pill ${problem.type.toLowerCase()}`}>
                          {problem.type}
                        </span>
                        <span className="match-result-domain">{problem.cat}</span>
                      </div>
                      <button
                        className="match-result-title"
                        type="button"
                        onClick={(event) => onOpen(problem, event.currentTarget)}
                      >
                        {problem.title}
                      </button>
                      <div className="match-result-details">
                        {skills.length > 0 && (
                          <span>
                            {overlap} matching {overlap === 1 ? "skill" : "skills"}
                          </span>
                        )}
                        <span>{problem.difficulty}</span>
                        <span>
                          {problem.weeksToBuild[0]}–{problem.weeksToBuild[1]} weeks
                        </span>
                      </div>
                      <button
                        className="match-result-open"
                        type="button"
                        onClick={(event) => onOpen(problem, event.currentTarget)}
                      >
                        Read full statement <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="match-empty">
                {skills.length
                  ? "No statements match the selected skills. Try removing a skill or choosing a different project type."
                  : "Try choosing a different project type or study year to see more ideas."}
              </p>
            )}
          </div>
        )}
      </form>
    </details>
  );
}
