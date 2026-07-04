import { useState } from "react";
import { useModStore } from "../../state/modStore";
import type { ModTreeNode } from "../../lib/tydClient";

export function ItemList() {
  const { modTree, openTab } = useModStore();

  const handleFileClick = (node: ModTreeNode) => {
    if (node.is_dir) return;
    openTab({
      id: node.path,
      name: node.name,
      path: node.path,
      content: "",
      modified: false,
      fileType: (node.file_type as "tyd" | "txt" | "json") || "tyd",
    });
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Files</h3>
      </div>
      <div className="p-2">
        {modTree.map((node) => (
          <TreeItem key={node.path} node={node} depth={0} onSelect={handleFileClick} />
        ))}
      </div>
    </div>
  );
}

function TreeItem({
  node,
  depth,
  onSelect,
}: {
  node: ModTreeNode;
  depth: number;
  onSelect: (node: ModTreeNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 1);

  return (
    <div>
      <button
        onClick={() => {
          if (node.is_dir) setExpanded(!expanded);
          else onSelect(node);
        }}
        className="w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-800 flex items-center gap-1.5"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {node.is_dir ? (
          <span className="text-gray-500 text-xs">{expanded ? "▼" : "▶"}</span>
        ) : (
          <span className="text-gray-600 text-xs ml-3.5">
            {node.file_type === "tyd" ? "📄" : node.file_type === "txt" ? "📝" : "📋"}
          </span>
        )}
        <span className={`${node.is_dir ? "text-gray-300" : "text-gray-400"}`}>{node.name}</span>
      </button>
      {node.is_dir && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem key={child.path} node={child} depth={depth + 1} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
