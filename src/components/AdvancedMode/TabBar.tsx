import { useModStore } from "../../state/modStore";
import type { Tab } from "../../state/modStore";

export function TabBar() {
  const { openTabs, activeTab, setActiveTab, closeTab } = useModStore();

  if (openTabs.length === 0) {
    return (
      <div className="h-9 bg-gray-900 border-b border-gray-800 flex items-center px-3">
        <span className="text-xs text-gray-600">No files open</span>
      </div>
    );
  }

  return (
    <div className="h-9 bg-gray-900 border-b border-gray-800 flex items-center overflow-x-auto">
      {openTabs.map((tab: Tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`h-full px-3 flex items-center gap-2 text-xs border-r border-gray-800 min-w-0 ${
            activeTab === tab.id
              ? "bg-gray-800 text-white"
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
          }`}
        >
          <span className="truncate max-w-28">{tab.name}</span>
          {tab.modified && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeTab(tab.id);
            }}
            className="ml-1 text-gray-600 hover:text-gray-300"
          >
            ×
          </button>
        </button>
      ))}
    </div>
  );
}
