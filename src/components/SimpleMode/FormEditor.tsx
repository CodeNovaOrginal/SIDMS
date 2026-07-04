import { useModStore } from "../../state/modStore";

export function FormEditor() {
  const { activeTab, openTabs } = useModStore();
  const tab = openTabs.find((t) => t.id === activeTab);

  if (!tab) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg">Select a file to edit</p>
          <p className="text-sm text-gray-700 mt-2">Choose a file from the left panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold text-white mb-6">{tab.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none"
              placeholder="Enter name..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none h-24 resize-none"
              placeholder="Enter description..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
