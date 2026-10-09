import { describe, expect, it } from "vitest";
import { createShortlistCsv } from "./csv.js";

describe("createShortlistCsv", () => {
  it("quotes CSV cells, escapes embedded quotes, and excludes internal keys", () => {
    const csv = createShortlistCsv([
      {
        id: "S0001",
        type: "Software",
        cat: "AI & Data",
        title: 'A "smart" field',
        desc: "Line one,\nline two",
      },
    ]);

    expect(csv).toBe(
      [
        "Type,Category,Problem statement,Description",
        '"Software","AI & Data","A ""smart"" field","Line one,\nline two"',
      ].join("\n"),
    );
    expect(csv).not.toContain("S0001");
  });
});
