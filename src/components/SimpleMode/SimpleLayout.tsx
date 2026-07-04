import { useModStore } from "../../state/modStore";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { ItemList } from "./ItemList";
import { FormEditor } from "./FormEditor";

export function SimpleLayout() {
  const { modName } = useModStore();

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SIDMS
          </span>
          <span className="text-gray-600">|</span>
          <span className="text-gray-400 text-sm">{modName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-400 bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-800">Simple Mode</span>
        </div>
      </header>

      {/* Content Type Tabs */}
      <ContentTypeSelector />

      {/* Main Content: Item List + Form Editor */}
      <div className="flex flex-1 overflow-hidden">
        <ItemList />
        <FormEditor />
      </div>
    </div>
  );
}
