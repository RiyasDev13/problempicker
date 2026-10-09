import { useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "All";
  const category = searchParams.get("topic") || "All";
  const difficulty = searchParams.get("difficulty") || "All";
  const sort = searchParams.get("sort") || "Default";
  const tags = searchParams.getAll("tag");
  const tagKey = JSON.stringify(tags);
  const deferredQuery = useDeferredValue(query);

  const updateParameter = (key, value, replace = false) => {
    const next = new URLSearchParams(searchParams);
    if (Array.isArray(value)) {
      next.delete(key);
      value.forEach((item) => next.append(key, item));
    } else if (value === "" || value === "All") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace });
  };
  const setType = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value === "All") next.delete("type");
    else next.set("type", value);
    next.delete("topic");
    setSearchParams(next);
  };
  const reset = () => {
    const next = new URLSearchParams(searchParams);
    ["q", "type", "topic", "difficulty", "tag", "sort"].forEach((key) => next.delete(key));
    setSearchParams(next);
  };

  return {
    query,
    setQuery: (value) => updateParameter("q", value, true),
    deferredQuery,
    type,
    setType,
    category,
    setCategory: (value) => updateParameter("topic", value),
    difficulty,
    setDifficulty: (value) => updateParameter("difficulty", value),
    sort,
    setSort: (value) => updateParameter("sort", value),
    tags,
    tagKey,
    setTags: (value) => updateParameter("tag", value),
    toggleTag: (tag) =>
      updateParameter(
        "tag",
        tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag],
      ),
    reset,
  };
}
