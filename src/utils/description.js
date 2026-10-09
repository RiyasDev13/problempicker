const SECTION_HEADINGS = [
  "Background",
  "Objective",
  "Key Challenges",
  "Expected Outcome",
  "Proposed Solution",
  "Expected Solution",
  "Benefits",
  "Scope",
];

const headingPattern = new RegExp(
  `(^|\\s)(${SECTION_HEADINGS.map((heading) => heading.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")).join("|")}):\\s*`,
  "gi",
);
const itemPattern = /(?:^|\s)([A-Z][A-Za-z0-9 /&()'-]{2,48}):\s+/g;

function parseLabeledItems(text) {
  const matches = [...text.matchAll(itemPattern)];
  if (matches.length < 2) return null;

  const first = matches[0].index + (matches[0][0].startsWith(" ") ? 1 : 0);
  const introduction = text.slice(0, first).trim();
  const items = matches.map((match, index) => {
    const valueStart = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? text.length;
    return { label: match[1], text: text.slice(valueStart, end).trim() };
  });

  return { introduction, items };
}

export function formatDescription(description) {
  const text = description.trim();
  if (!text) return [];

  const headings = [...text.matchAll(headingPattern)];
  const sections = [];
  if (headings.length === 0) {
    sections.push({ heading: null, text });
  } else {
    const firstHeading = headings[0];
    const introduction = text.slice(0, firstHeading.index).trim();
    if (introduction) sections.push({ heading: null, text: introduction });

    headings.forEach((match, index) => {
      const contentStart = match.index + match[0].length;
      const contentEnd = headings[index + 1]?.index ?? text.length;
      sections.push({
        heading: match[2],
        text: text.slice(contentStart, contentEnd).trim(),
      });
    });
  }

  return sections.map((section) => ({
    ...section,
    list: parseLabeledItems(section.text),
  }));
}
