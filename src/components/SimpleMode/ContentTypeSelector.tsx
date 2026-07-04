export function ContentTypeSelector() {
  return (
    <div className="flex border-b border-gray-800 bg-gray-900">
      {["Software Types", "Personalities", "Company Types", "Mod Metadata"].map((label, i) => (
        <button
          key={label}
          className={`px-5 py-3 text-sm font-medium transition-colors ${
            i === 0
              ? "text-white border-b-2 border-blue-500 bg-gray-800/50"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/30"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
