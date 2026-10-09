export default function CompareTable({ problems }) {
  if (!problems.length) return null;

  return (
    <div className="compare-scroll" role="region" aria-label="Problem comparison" tabIndex="0">
      <table className="compare-table">
        <caption>Compare shortlisted problems</caption>
        <thead>
          <tr>
            <th scope="col">Details</th>
            {problems.map((problem) => (
              <th scope="col" key={problem.id}>
                {problem.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Topic</th>
            {problems.map((problem) => (
              <td key={problem.id}>{problem.cat}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Skills</th>
            {problems.map((problem) => (
              <td key={problem.id}>{problem.tags.join(", ") || "None listed"}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Difficulty</th>
            {problems.map((problem) => (
              <td key={problem.id}>{problem.difficulty}</td>
            ))}
          </tr>
          <tr>
            <th scope="row">Description length</th>
            {problems.map((problem) => (
              <td key={problem.id}>{problem.desc.length.toLocaleString()} characters</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
