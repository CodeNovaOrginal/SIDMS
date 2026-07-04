import { useState, useEffect, useCallback } from "react";
import { useModStore } from "../../state/modStore";
import { FileTextIcon, SaveIcon } from "../../assets/icons/Icons";
import { readTydContent, writeTydFile, previewTyd } from "../../lib/tydClient";

export function FormEditor() {
  const { activeTab, openTabs, markTabSaved, updateTabContent, addConsoleLog } = useModStore();
  const tab = openTabs.find((t) => t.id === activeTab);

  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load file content when tab changes
  useEffect(() => {
    if (!tab) {
      setFileContent("");
      setPreview(null);
      return;
    }
    setLoading(true);
    setPreview(null);
    readTydContent(tab.path)
      .then((content) => {
        setFileContent(content);
        updateTabContent(tab.id, content);
      })
      .catch((err) => {
        addConsoleLog(`ERROR loading ${tab.path}: ${err}`);
        setFileContent("");
      })
      .finally(() => setLoading(false));
  }, [tab?.id, tab?.path]);

  const handleSave = useCallback(async () => {
    if (!tab) return;
    setSaving(true);
    try {
      const result = await writeTydFile(tab.path, fileContent);
      addConsoleLog(result.message);
      markTabSaved(tab.id);
    } catch (err) {
      addConsoleLog(`ERROR saving: ${err}`);
    }
    setSaving(false);
  }, [tab, fileContent, addConsoleLog, markTabSaved]);

  const handlePreview = useCallback(async () => {
    if (!tab) return;
    try {
      const compiled = await previewTyd(fileContent);
      setPreview(compiled);
      addConsoleLog("Preview generated");
    } catch (err) {
      addConsoleLog(`ERROR previewing: ${err}`);
    }
  }, [tab, fileContent, addConsoleLog]);

  if (!tab) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="mb-4 text-gray-700">
            <FileTextIcon className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-lg">Select a file to edit</p>
          <p className="text-sm text-gray-700 mt-1">Choose a file from the left panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">{tab.name}</h2>
          {tab.modified && <span className="w-2 h-2 rounded-full bg-orange-400" />}
          <span className="text-xs text-gray-600 ml-2">{tab.path}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <SaveIcon className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-300 transition-colors cursor-pointer"
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 flex overflow-hidden">
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <p className="text-sm">Loading file...</p>
          </div>
        ) : preview !== null ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-1.5 bg-gray-900 border-b border-gray-800 shrink-0">
              <span className="text-xs text-gray-500">Compiled Output (read-only)</span>
              <button
                onClick={() => setPreview(null)}
                className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-sm text-green-400 font-mono whitespace-pre-wrap">
              {preview}
            </pre>
          </div>
        ) : (
          <textarea
            value={fileContent}
            onChange={(e) => {
              setFileContent(e.target.value);
              if (tab) updateTabContent(tab.id, e.target.value);
            }}
            className="flex-1 w-full bg-gray-950 text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none"
            placeholder="TyD content..."
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
