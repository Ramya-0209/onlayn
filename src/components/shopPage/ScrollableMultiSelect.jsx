import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ScrollableMultiSelect({
  options = [],         
  values = [],          
  onChange,              
  placeholder = "Select…",
  maxHeightClass = "max-h-56",
  className = "",
  disabled = false,
  searchable = true,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  const valueSet = useMemo(
    () => new Set(values.map((v) => v.toLowerCase())),
    [values]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      const panel = panelRef.current;
      const btn = btnRef.current;
      if (panel && !panel.contains(e.target) && btn && !btn.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const toggle = (opt) => {
    const lowerOpt = opt.toLowerCase();
    const next = new Set(valueSet);
    if (next.has(lowerOpt)) {
      next.delete(lowerOpt);
    } else {
      next.add(lowerOpt);
    }
    // rebuild values array by preserving original casing from options
    const updated = options.filter((o) => next.has(o.toLowerCase()));
    onChange(updated);
  };

  const selectAll = () => onChange([...filtered]);
  const clearAll  = () => onChange([]);

  const triggerLabel = useMemo(() => {
    if (!values.length) return placeholder;
    if (values.length === 1) return values[0];
    return `${values.length} selected`;
  }, [values, placeholder]);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full inline-flex items-center justify-between cursor-pointer gap-2 px-3 py-2
                    rounded-lg border border-gray-300 bg-white text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-pink-400
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <span className={`truncate ${values.length ? "" : "text-gray-500"}`}>
          {triggerLabel}
        </span>
        <svg width="18" height="18" viewBox="0 0 20 20" className={`transition ${open ? "rotate-180" : ""}`}>
          <path d="M5.5 7.5L10 12l4.5-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
        >
          {/* Header: actions + search */}
          <div className="px-1 py-2 border-b border-gray-100 flex items-center gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs px-2 py-1 rounded border border-gray-300 hover:bg-gray-50"
            >
              Clear
            </button>
            {searchable && (
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brands…"
                className="ml-auto w-1/2 px-1 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            )}
          </div>

          {/* Options */}
          <div className={`${maxHeightClass} overflow-y-auto`}>
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
            ) : (
              filtered.map((opt) => {
                const checked = valueSet.has(opt.toLowerCase());
                return (
                  <label
                    key={opt}
                    className={`px-3 py-2 flex items-center gap-2 cursor-pointer text-sm hover:bg-blue-50
                                ${checked ? "text-[#014aaf] font-medium" : "text-gray-800"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(opt)}
                      className="accent-[#014aaf]"
                    />
                    <span className="truncate">{opt}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
