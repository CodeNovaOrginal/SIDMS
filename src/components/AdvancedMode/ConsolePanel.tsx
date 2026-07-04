import { useRef, useEffect } from "react";
import { useModStore } from "../../state/modStore";

export function ConsolePanel() {
  const { consoleLog } = useModStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLog]);

  return (
    <div className="h-32 border-t border-gray-800 bg-gray-900 flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Console</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs space-y-0.5">
        {consoleLog.length === 0 ? (
          <p className="text-gray-700">No output</p>
        ) : (
          consoleLog.map((msg: string, i: number) => (
            <div key={i} className="text-gray-400">{msg}</div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
