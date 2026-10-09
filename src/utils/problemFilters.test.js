import { describe, expect, it } from "vitest";
import { filterProblems } from "./problemFilters.js";

const problems = [
  {
    id: "S0001",
    type: "Software",
    cat: "AI & Data",
    difficulty: "Intermediate",
    title: "Field crop helper",
    desc: "Uses sensors to track soil",
    tags: ["AI/ML", "IoT"],
  },
  {
    id: "H0002",
    type: "Hardware",
    cat: "Agriculture & Food",
    difficulty: "Advanced",
    title: "Water valve controller",
    desc: "Automates irrigation",
    tags: ["IoT", "Embedded"],
  },
];

describe("filterProblems", () => {
  it("applies type, topic, difficulty, and AND tag filters together", () => {
    expect(
      filterProblems(problems, {
        type: "Software",
        category: "AI & Data",
        difficulty: "Intermediate",
        tags: ["AI/ML", "IoT"],
        query: "",
      }).map((problem) => problem.title),
    ).toEqual(["Field crop helper"]);
  });

  it("matches every search word in titles or descriptions, never internal keys", () => {
    expect(
      filterProblems(problems, {
        type: "All",
        category: "All",
        difficulty: "All",
        tags: [],
        query: "soil sensors",
      }),
    ).toHaveLength(1);
    expect(
      filterProblems(problems, {
        type: "All",
        category: "All",
        difficulty: "All",
        tags: [],
        query: "S0001",
      }),
    ).toHaveLength(0);
  });
});
