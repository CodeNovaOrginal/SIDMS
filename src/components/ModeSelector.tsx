import { useState } from "react";
import { useModStore } from "../state/modStore";
import { open } from "@tauri-apps/plugin-dialog";
import { listModTree } from "../lib/tydClient";
import { PaintBrushIcon, KeyboardIcon } from "../assets/icons/Icons";

export function ModeSelector() {
  const { setMode, setModPath, setModName, setModTree, addConsoleLog } = useModStore();
  const [hoveredMode, setHoveredMode] = useState<"simple" | "advanced" | null>(null);

  const handleOpenMod = async (mode: "simple" | "advanced") => {
    try {
      addConsoleLog(`Opening folder dialog (${mode} mode)...`);
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Open Mod Folder",
      });
      addConsoleLog(`Selected: ${selected}`);
      if (selected) {
        const path = selected as string;
        setModPath(path);
        const folderName = path.split(/[\\/]/).pop() || "Mod";
        setModName(folderName);
        addConsoleLog(`Loading mod tree from ${path}...`);
        const tree = await listModTree(path);
        addConsoleLog(`Found ${tree.length} top-level items`);
        setModTree(tree);
        setMode(mode);
      }
    } catch (err) {
      addConsoleLog(`ERROR: ${err}`);
      console.error("handleOpenMod failed:", err);
    }
  };

  const handleNewMod = async (mode: "simple" | "advanced") => {
    try {
      addConsoleLog(`Opening parent folder dialog...`);
      const selected = await open({
        directory: true,
        multiple: false,
        title: "Select Parent Directory for New Mod",
      });
      if (selected) {
        setModPath(selected as string);
        setModName("New Mod");
        setMode(mode);
      }
    } catch (err) {
      addConsoleLog(`ERROR: ${err}`);
      console.error("handleNewMod failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center select-none">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Software Inc.
        </h1>
        <h2 className="text-xl text-gray-400">Data Mod Studio</h2>
      </div>

      {/* Mode Cards */}
      <div className="flex gap-8 mb-10">
        <button
          onClick={() => handleOpenMod("simple")}
          onMouseEnter={() => setHoveredMode("simple")}
          onMouseLeave={() => setHoveredMode(null)}
          className={`w-72 h-56 rounded-2xl p-8 transition-all duration-200 text-left border-2 cursor-pointer ${
            hoveredMode === "simple"
              ? "bg-blue-900/40 border-blue-500 shadow-lg shadow-blue-500/20"
              : "bg-gray-800/60 border-gray-700 hover:border-gray-500"
          }`}
        >
          <div className="mb-4 text-blue-400">
            <PaintBrushIcon className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Simple Mode</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Guided wizard UI. Pick a content type, fill in forms, save.
            No raw TyD editing.
          </p>
          <p className="text-gray-500 text-xs mt-4">Best for beginners</p>
        </button>

        <button
          onClick={() => handleOpenMod("advanced")}
          onMouseEnter={() => setHoveredMode("advanced")}
          onMouseLeave={() => setHoveredMode(null)}
          className={`w-72 h-56 rounded-2xl p-8 transition-all duration-200 text-left border-2 cursor-pointer ${
            hoveredMode === "advanced"
              ? "bg-purple-900/40 border-purple-500 shadow-lg shadow-purple-500/20"
              : "bg-gray-800/60 border-gray-700 hover:border-gray-500"
          }`}
        >
          <div className="mb-4 text-purple-400">
            <KeyboardIcon className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Advanced Mode</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Full IDE with file tree, raw TyD editing, tabs, inspector,
            and console panel.
          </p>
          <p className="text-gray-500 text-xs mt-4">For experienced modders</p>
        </button>
      </div>

      {/* New Mod Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleNewMod("simple")}
          className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 text-sm text-gray-300 transition-colors cursor-pointer"
        >
          + New Mod (Simple)
        </button>
        <button
          onClick={() => handleNewMod("advanced")}
          className="px-5 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-500 text-sm text-gray-300 transition-colors cursor-pointer"
        >
          + New Mod (Advanced)
        </button>
      </div>

      {/* Footer */}
      <p className="mt-10 text-xs text-gray-700">v0.1.0 Beta</p>
    </div>
  );
}
