import { useCallback, useEffect, useState } from "react";

function readSavedProblems() {
  try {
    return JSON.parse(localStorage.getItem("saved") || "[]");
  } catch (error) {
    console.warn("Could not read the saved shortlist from browser storage.", error);
    return [];
  }
}

export function useSavedProblems() {
  const [saved, setSaved] = useState(readSavedProblems);

  useEffect(() => {
    try {
      localStorage.setItem("saved", JSON.stringify(saved));
    } catch (error) {
      console.warn("Could not save the shortlist to browser storage.", error);
    }
  }, [saved]);

  const toggleSaved = useCallback((id) => {
    setSaved((current) =>
      current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id],
    );
  }, []);

  return { saved, setSaved, toggleSaved };
}
