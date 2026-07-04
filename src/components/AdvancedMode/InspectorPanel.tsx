import { useModStore } from "../../state/modStore";

export function InspectorPanel() {
  const { validationErrors } = useModStore();

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inspector</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Validation */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">
            Validation ({validationErrors.length})
          </h4>
          {validationErrors.length === 0 ? (
            <p className="text-xs text-green-400">No issues</p>
          ) : (
            <div className="space-y-1">
              {validationErrors.map((err, i) => (
                <div
                  key={i}
                  className={`text-xs p-2 rounded ${
                    err.severity === "error"
                      ? "bg-red-900/30 text-red-400"
                      : "bg-yellow-900/30 text-yellow-400"
                  }`}
                >
                  {err.message}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TyD Cheatsheet */}
        <div>
          <h4 className="text-xs font-semibold text-gray-400 mb-2">TyD Reference</h4>
          <div className="text-xs text-gray-500 space-y-1 font-mono">
            <p>Record: <span className="text-gray-400">Name Value</span></p>
            <p>Table: <span className="text-gray-400">{"{ }"}</span></p>
            <p>List: <span className="text-gray-400">[ A; B; C ]</span></p>
            <p>String: <span className="text-gray-400">"quoted"</span></p>
            <p>Comment: <span className="text-gray-400"># to end of line</span></p>
            <p>Bool: <span className="text-gray-400">True / False</span></p>
            <p>Vert: <span className="text-gray-400">| line text</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
