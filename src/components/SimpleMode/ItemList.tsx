import { useState } from "react";
import { useModStore } from "../../state/modStore";
import type { ModTreeNode } from "../../lib/tydClient";
import { FolderIcon, FolderOpenIcon, FileIcon } from "../../assets/icons/Icons";

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
    <div className="w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto shrink-0">
      <div className="p-3 border-b border-gray-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Files</h3>
      </div>
      <div className="p-1.5">
        {modTree.map((node) => (
          <TreeItem key={node.path} node={node} depth={0} onSelect={handleFileClick} />
        ))}
        {modTree.length === 0 && (
          <p className="text-xs text-gray-600 px-2 py-4 text-center">No files loaded</p>
        )}
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
        className="w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-800 flex items-center gap-1.5 group"
        style={{ paddingLeft: `${depth * 14 + 6}px` }}
      >
        {node.is_dir ? (
          <span className="text-gray-500 shrink-0">
            {expanded ? <FolderOpenIcon className="w-4 h-4" /> : <FolderIcon className="w-4 h-4" />}
          </span>
        ) : (
          <span className="text-gray-600 shrink-0">
            <FileIcon className="w-4 h-4" />
          </span>
        )}
        <span className="text-gray-400 group-hover:text-gray-200 truncate">{node.name}</span>
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
