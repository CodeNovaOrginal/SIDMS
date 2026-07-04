import { useModStore } from "../../state/modStore";
import { FileTextIcon } from "../../assets/icons/Icons";

export function FormEditor() {
  const { activeTab, openTabs } = useModStore();
  const tab = openTabs.find((t) => t.id === activeTab);

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
    <div className="flex-1 overflow-y-auto bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">{tab.name}</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
              Save
            </button>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm text-gray-300 transition-colors">
              Preview
            </button>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Basic Info</h3>
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

        <div className="text-xs text-gray-600 text-center py-4 border border-dashed border-gray-800 rounded-lg">
          Additional fields will appear based on content type
        </div>
      </div>
    </div>
  );
}
