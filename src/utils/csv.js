function escapeCell(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function createShortlistCsv(problems) {
  const rows = problems.map((problem) =>
    [problem.type, problem.cat, problem.title, problem.desc].map(escapeCell).join(","),
  );
  return ["Type,Category,Problem statement,Description", ...rows].join("\n");
}

export function downloadShortlistCsv(problems) {
  const blob = new Blob([createShortlistCsv(problems)], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const anchor = Object.assign(document.createElement("a"), {
    href: url,
    download: "my-shortlist.csv",
  });
  anchor.click();
  URL.revokeObjectURL(url);
}
