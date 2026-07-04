import { useState } from "react";
import { useModStore, type ContentType } from "../../state/modStore";
import type { ModTreeNode } from "../../lib/tydClient";
import { FolderIcon, FolderOpenIcon, FileIcon, PlusIcon } from "../../assets/icons/Icons";

const CONTENT_TYPE_MAP: Record<ContentType, { folder?: string; file?: string; label: string }> = {
  softwareTypes: { folder: "SoftwareTypes", label: "Software Types" },
  personalities: { file: "Personalities.tyd", label: "Personalities" },
  companyTypes: { folder: "CompanyTypes", label: "Company Types" },
  meta: { file: "meta.tyd", label: "Mod Metadata" },
};

export function ItemList() {
  const { modTree, modPath, contentType, openTab, addConsoleLog, setModTree } = useModStore();
  const [showNewInput, setShowNewInput] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const config = CONTENT_TYPE_MAP[contentType];

  // Find relevant nodes based on content type
  const getVisibleNodes = (): ModTreeNode[] => {
    if (config.folder) {
      // Show files inside a specific folder
      const folder = modTree.find((n) => n.name === config.folder && n.is_dir);
      return folder?.children || [];
    } else if (config.file) {
      // Show the specific file
      const file = modTree.find((n) => n.name === config.file && !n.is_dir);
      return file ? [file] : [];
    }
    return modTree;
  };

  const visibleNodes = getVisibleNodes();

  const handleFileClick = (node: ModTreeNode) => {
    if (node.is_dir) return;
    openTab({
      id: node.path,
      name: node.name,
      path: node.path,
      content: "",
      modified: false,
      fileType: node.file_type === "txt" ? "txt" : "tyd",
    });
  };

  const handleNewFile = async () => {
    if (!newFileName.trim() || !modPath) return;
    const { writeTydFile } = await import("../../lib/tydClient");
    try {
      let filePath: string;
      if (config.folder) {
        const fileName = newFileName.endsWith(".tyd") ? newFileName : `${newFileName}.tyd`;
        filePath = `${modPath}/${config.folder}/${fileName}`;
        // Create default TyD content based on content type
        let content = "";
        if (contentType === "softwareTypes") {
          content = `SoftwareType\n{\n\tName\t\t"${newFileName}"\n\tDescription\t""\n\tSubmarketNames\t[ Sub1; Sub2; Sub3 ]\n\tOptimalDevTime\t30\n}`;
        } else if (contentType === "companyTypes") {
          content = `CompanyType\n{\n\tSpecialization\t"${newFileName}"\n\tPerYear\t\t0.2\n\tMin\t\t2\n\tMax\t\t4\n\tTypes\n\t\t[\n\t\t{\n\t\t\tSoftware\t"${newFileName}"\n\t\t\tChance\t\t1\n\t\t}\n\t\t]\n}`;
        }
        await writeTydFile(filePath, content);
      } else if (contentType === "personalities") {
        filePath = `${modPath}/Personalities.tyd`;
        const content = `PersonalityGraph\n{\n\tPersonalities\n\t\t[\n\t\t{\n\t\t\tName\t\t${newFileName}\n\t\t\tTraits\t\t[ BornLeader ]\n\t\t}\n\t\t]\n\tIncompatibilities\n\t\t[\n\t\t]\n}`;
        await writeTydFile(filePath, content);
      } else if (contentType === "meta") {
        filePath = `${modPath}/meta.tyd`;
        const content = `Meta\n{\n\tName\t\t"${newFileName}"\n\tDescription\t""\n\tAuthor\t\t""\n}`;
        await writeTydFile(filePath, content);
      } else {
        return;
      }
      addConsoleLog(`Created: ${filePath}`);

      // Reload mod tree
      const { listModTree } = await import("../../lib/tydClient");
      const tree = await listModTree(modPath);
      setModTree(tree);

      // Open the new file
      openTab({
        id: filePath,
        name: filePath.split("/").pop() || newFileName,
        path: filePath,
        content: "",
        modified: false,
        fileType: "tyd",
      });
    } catch (err) {
      addConsoleLog(`ERROR creating file: ${err}`);
    }
    setNewFileName("");
    setShowNewInput(false);
  };

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-800 overflow-y-auto shrink-0 flex flex-col">
      <div className="p-3 border-b border-gray-800 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{config.label}</h3>
        <button
          onClick={() => setShowNewInput(!showNewInput)}
          className="text-gray-500 hover:text-gray-300 p-1 rounded hover:bg-gray-800 cursor-pointer"
          title={`New ${config.label.slice(0, -1)}`}
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {showNewInput && (
        <div className="p-2 border-b border-gray-800">
          <div className="flex gap-1.5">
            <input
              autoFocus
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNewFile()}
              placeholder="Name..."
              className="flex-1 bg-gray-950 border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleNewFile}
              className="px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white cursor-pointer"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 p-1.5 overflow-y-auto">
        {visibleNodes.length === 0 ? (
          <p className="text-xs text-gray-600 px-2 py-6 text-center">
            No {config.label.toLowerCase()} yet.
            <br />
            <span className="text-gray-700">Click + to create one.</span>
          </p>
        ) : (
          visibleNodes.map((node) => (
            <TreeItem key={node.path} node={node} depth={0} onSelect={handleFileClick} />
          ))
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
  const [expanded, setExpanded] = useState(depth < 2);

  return (
    <div>
      <button
        onClick={() => {
          if (node.is_dir) setExpanded(!expanded);
          else onSelect(node);
        }}
        className="w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-800 flex items-center gap-1.5 group cursor-pointer"
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
