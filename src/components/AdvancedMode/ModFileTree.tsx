import { useState } from "react";
import { useModStore } from "../../state/modStore";
import type { ModTreeNode } from "../../lib/tydClient";

export function ModFileTree() {
  const { modTree, openTab } = useModStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (path: string) => {
    setExpanded((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Explorer</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {modTree.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            depth={0}
            expanded={expanded}
            onToggle={toggleExpand}
            onSelect={(n) => {
              if (!n.is_dir) {
                openTab({
                  id: n.path,
                  name: n.name,
                  path: n.path,
                  content: "",
                  modified: false,
                  fileType: (n.file_type as "tyd" | "txt" | "json") || "tyd",
                });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TreeNode({
  node,
  depth,
  expanded,
  onToggle,
  onSelect,
}: {
  node: ModTreeNode;
  depth: number;
  expanded: Record<string, boolean>;
  onToggle: (path: string) => void;
  onSelect: (node: ModTreeNode) => void;
}) {
  const isExpanded = expanded[node.path] ?? depth < 1;

  return (
    <div>
      <button
        onClick={() => {
          if (node.is_dir) onToggle(node.path);
          else onSelect(node);
        }}
        className="w-full text-left px-2 py-0.5 text-sm rounded hover:bg-gray-800 flex items-center gap-1"
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
      >
        {node.is_dir ? (
          <span className="text-gray-500 text-[10px] w-3">{isExpanded ? "▼" : "▶"}</span>
        ) : (
          <span className="text-gray-600 text-[10px] w-3" />
        )}
        <span className="text-[10px] mr-1">
          {node.is_dir ? "📁" : node.file_type === "tyd" ? "📄" : "📝"}
        </span>
        <span className="text-gray-400 truncate">{node.name}</span>
      </button>
      {node.is_dir && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNode
              key={child.path}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
