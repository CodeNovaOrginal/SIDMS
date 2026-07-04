import { useState } from "react";

function App() {
  const [mode, setMode] = useState<"simple" | "advanced" | null>(null);

  if (!mode) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Software Inc. Data Mod Studio</h1>
        <div className="flex gap-8">
          <button
            onClick={() => setMode("simple")}
            className="w-64 h-40 bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">Simple Mode</h2>
            <p className="text-gray-400 text-sm">MCreator-style wizard UI</p>
          </button>
          <button
            onClick={() => setMode("advanced")}
            className="w-64 h-40 bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2">Advanced Mode</h2>
            <p className="text-gray-400 text-sm">Full IDE with raw TyD editing</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <p>Mode selected: {mode}</p>
      <button onClick={() => setMode(null)}>Back to mode selection</button>
    </div>
  );
}

export default App;
