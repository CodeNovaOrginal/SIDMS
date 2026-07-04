import { useModStore } from "../../state/modStore";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { ItemList } from "./ItemList";
import { FormEditor } from "./FormEditor";

export function SimpleLayout() {
  const { modName } = useModStore();

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SIDMS
          </span>
          <span className="text-gray-500">|</span>
          <span className="text-gray-400 text-sm">{modName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Simple Mode</span>
        </div>
      </header>

      <ContentTypeSelector />

      <div className="flex flex-1 overflow-hidden">
        <ItemList />
        <FormEditor />
      </div>
    </div>
  );
}
