import { useModStore } from "../../state/modStore";
import { ModFileTree } from "./ModFileTree";
import { TabBar } from "./TabBar";
import { EditorPane } from "./EditorPane";
import { InspectorPanel } from "./InspectorPanel";
import { ConsolePanel } from "./ConsolePanel";

export function AdvancedLayout() {
  const { modName } = useModStore();

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SIDMS
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400 text-sm">{modName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Advanced Mode</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-60 border-r border-gray-800 flex flex-col">
          <ModFileTree />
        </div>

        {/* Center + Right */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <TabBar />

          {/* Editor Area + Inspector */}
          <div className="flex flex-1 overflow-hidden">
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <EditorPane />
            </div>

            {/* Right Inspector */}
            <div className="w-72 border-l border-gray-800 overflow-y-auto">
              <InspectorPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Console */}
      <ConsolePanel />
    </div>
  );
}
