import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSavedProblems } from "./useSavedProblems.js";

describe("useSavedProblems", () => {
  beforeEach(() => localStorage.clear());

  it("loads and persists the saved problem keys", async () => {
    localStorage.setItem("saved", JSON.stringify(["S0001"]));
    const { result } = renderHook(() => useSavedProblems());

    expect(result.current.saved).toEqual(["S0001"]);
    act(() => result.current.toggleSaved("H0002"));
    expect(result.current.saved).toEqual(["S0001", "H0002"]);

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("saved"))).toEqual(["S0001", "H0002"]);
    });
  });

  it("removes an already saved key", () => {
    localStorage.setItem("saved", JSON.stringify(["S0001"]));
    const { result } = renderHook(() => useSavedProblems());
    act(() => result.current.toggleSaved("S0001"));
    expect(result.current.saved).toEqual([]);
  });
});
