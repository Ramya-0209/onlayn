import { useEffect, useRef, useState } from "react";

const URL = "https://apis.toyshack.in/Dashboard/categories/categories";

export default function useCategories(
  { includeAll = true, cacheKey = "categories:v2", withCredentials = false } = {}
) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  const pickArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.categories)) return data.categories;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    if (Array.isArray(data?.items)) return data.items;
    return [];
  };

  const normalize = (arr) => {
      const names = arr
        .map((c) =>
          typeof c === "string"
            ? c
            : c?.categoryName             
              ?? c?.name
              ?? c?.category
              ?? c?.title
              ?? c?.label
              ?? c?.slug
              ?? ""
        )
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean);
    
      const unique = [...new Set(names)];
      return unique.sort((a, b) => a.localeCompare(b));
    };
    

  useEffect(() => {
    setLoading(true);
    setError("");

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCategories(parsed);
      } catch {}
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const res = await fetch(URL, {
          signal: ac.signal,
          ...(withCredentials ? { credentials: "include" } : {}),
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();

        const picked = pickArray(raw);
        const normalized = normalize(picked);
        const withAll = includeAll ? ["All", ...normalized] : normalized;

        setCategories(withAll);
        sessionStorage.setItem(cacheKey, JSON.stringify(withAll));
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error("Categories fetch failed:", e);
          setError("Unable to load categories");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [cacheKey, includeAll, withCredentials]);

  return { categories, loading, error };
}
