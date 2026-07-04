import { useState } from "react";
import { useModStore } from "../../state/modStore";
import { FileTextIcon } from "../../assets/icons/Icons";

export function EditorPane() {
  const { activeTab, openTabs } = useModStore();
  const tab = openTabs.find((t) => t.id === activeTab);
  const [viewMode, setViewMode] = useState<"visual" | "raw">("raw");

  if (!tab) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="mb-3 text-gray-700">
            <FileTextIcon className="w-10 h-10 mx-auto" />
          </div>
          <p className="text-lg">No file selected</p>
          <p className="text-sm text-gray-700 mt-1">Open a file from the explorer</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* View mode toggle */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-1 bg-gray-800 rounded p-0.5">
          <button
            onClick={() => setViewMode("visual")}
            className={`px-3 py-1 rounded text-xs ${
              viewMode === "visual" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Visual
          </button>
          <button
            onClick={() => setViewMode("raw")}
            className={`px-3 py-1 rounded text-xs ${
              viewMode === "raw" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Raw TyD
          </button>
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "raw" ? (
          <textarea
            value={tab.content}
            onChange={(_e) => {
              // Would update via store
            }}
            className="w-full h-full bg-gray-950 text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
            placeholder="TyD content will appear here..."
            spellCheck={false}
          />
        ) : (
          <div className="p-4 text-gray-600 text-sm">
            Visual editor will appear here based on file type
          </div>
        )}
      </div>
    </div>
  );
}
