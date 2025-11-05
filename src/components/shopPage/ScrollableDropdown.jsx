import React, { useEffect, useRef, useState } from "react";

const Chevron = ({ open }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 20 20"
    className={`transition ${open ? "rotate-180" : ""}`}
    aria-hidden="true"
  >
    <path
      d="M5.5 7.5L10 12l4.5-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function ScrollableDropdown({
  options = [],
  value = "",
  onChange,
  placeholder = "Select…",
  maxHeightClass = "max-h-56",
  className = "",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const btnRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const idx = options.findIndex(
      (o) => o.toLowerCase() === value?.toLowerCase()
    );
    setActiveIndex(Math.max(0, idx));
  }, [options, value]);

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

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const el = panelRef.current.querySelector(`[data-index="${activeIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const select = (idx) => {
    const opt = options[idx];
    if (!opt) return;
    onChange && onChange(opt);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (disabled) return;

    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      const idx = options.findIndex(
        (o) => o.toLowerCase() === value?.toLowerCase()
      );
      setActiveIndex(Math.max(0, idx));
      setOpen(true);
      return;
    }
    if (!open || !options.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(Math.max(0, options.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const openPanel = () => {
    if (disabled) return;
    const idx = options.findIndex(
      (o) => o.toLowerCase() === value?.toLowerCase()
    );
    setActiveIndex(Math.max(0, idx));
    setOpen((o) => !o);
  };

  const displayText =
    options.find((o) => o.toLowerCase() === value?.toLowerCase()) || value || "";

  return (
    <div className="relative" onKeyDown={onKeyDown}>
      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
        disabled={disabled}
        className={`w-full inline-flex items-center justify-between cursor-pointer gap-2 px-3 py-2
                    rounded-lg border border-gray-300 bg-white text-gray-800
                    focus:outline-none focus:ring-2 focus:ring-pink-400
                    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
                    ${className}`}
        onClick={openPanel}
      >
        <span className="truncate">
          {displayText || <span className="text-gray-500">{placeholder}</span>}
        </span>
        <Chevron open={open} />
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          role="listbox"
          tabIndex={-1}
          className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
        >
          <div className={`${maxHeightClass} overflow-y-auto`}>
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options</div>
            ) : (
              options.map((opt, idx) => {
                const selected =
                  value?.toLowerCase() === opt.toLowerCase();
                const active = idx === activeIndex;
                return (
                  <div
                    key={`${opt}-${idx}`}
                    role="option"
                    aria-selected={selected}
                    data-index={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => select(idx)}
                    className={`px-3 py-2 cursor-pointer select-none text-sm
                      ${active ? "bg-blue-50" : ""}
                      ${selected ? "text-[#014aaf] font-medium" : "text-gray-800"}
                      hover:bg-blue-50`}
                  >
                    {opt}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
