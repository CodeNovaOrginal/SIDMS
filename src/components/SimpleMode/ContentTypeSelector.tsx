import React from "react";
import { useModStore, type ContentType } from "../../state/modStore";

const CONTENT_TYPES: { key: ContentType; label: string; icon: React.ReactNode }[] = [
  {
    key: "softwareTypes",
    label: "Software Types",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
      </svg>
    ),
  },
  {
    key: "personalities",
    label: "Personalities",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "companyTypes",
    label: "Company Types",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" />
        <path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" />
        <path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
      </svg>
    ),
  },
  {
    key: "meta",
    label: "Mod Metadata",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
];

export function ContentTypeSelector() {
  const { contentType, setContentType } = useModStore();

  return (
    <div className="flex border-b border-gray-800 bg-gray-900 shrink-0">
      {CONTENT_TYPES.map((ct) => (
        <button
          key={ct.key}
          onClick={() => setContentType(ct.key)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            contentType === ct.key
              ? "text-white border-b-2 border-blue-500 bg-gray-800/50"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
          }`}
        >
          {ct.icon}
          {ct.label}
        </button>
      ))}
    </div>
  );
}
