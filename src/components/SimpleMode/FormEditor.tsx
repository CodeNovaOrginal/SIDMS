import { useState, useEffect, useCallback } from "react";
import { useModStore } from "../../state/modStore";
import { FileTextIcon, SaveIcon } from "../../assets/icons/Icons";
import { readTydContent, writeTydFile, listModTree } from "../../lib/tydClient";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FV = any;

function parseTyd(content: string): FV {
  const result: FV = {};
  const lines = content.split("\n");
  let inBlock = false;
  let depth = 0;

  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;

    if (t === "{") { inBlock = true; depth++; continue; }
    if (t === "}") { depth--; if (depth <= 0) { inBlock = false; depth = 0; } continue; }

    const m = t.match(/^(\w+)\s+(.+)$/);
    if (m && !inBlock) {
      const [, k, v] = m;
      if (v === "{") { inBlock = true; depth = 1; result[k] = {}; }
      else if (v.startsWith("[")) {
        const inner = v.replace(/^\[/, "").replace(/\]$/, "").trim();
        result[k] = inner ? inner.split(";").map((s) => s.trim().replace(/"/g, "")) : [];
      }
      else if (v === "True" || v === "False") result[k] = v === "True";
      else if (!isNaN(Number(v)) && v !== "") result[k] = Number(v);
      else result[k] = v.replace(/^"|"$/g, "");
    }
  }
  return result;
}

function tydFromFields(obj: FV, indent = 0): string {
  const pad = "\t".repeat(indent);
  const lines: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      lines.push(`${pad}${k}\t\t${v.includes(" ") || v === "" ? '"' + v + '"' : v}`);
    } else if (typeof v === "number") {
      lines.push(`${pad}${k}\t\t${v}`);
    } else if (typeof v === "boolean") {
      lines.push(`${pad}${k}\t\t${v ? "True" : "False"}`);
    } else if (Array.isArray(v)) {
      lines.push(`${pad}${k}\t\t[ ${v.join("; ")} ]`);
    } else if (typeof v === "object" && v !== null) {
      lines.push(`${pad}${k}`);
      lines.push(`${pad}{`);
      lines.push(tydFromFields(v, indent + 1));
      lines.push(`${pad}}`);
    }
  }
  return lines.join("\n");
}

export function FormEditor() {
  const { activeTab, openTabs, contentType, markTabSaved, updateTabContent, addConsoleLog, modPath, setModTree } = useModStore();
  const tab = openTabs.find((t) => t.id === activeTab);
  const [fields, setFields] = useState<FV>({});
  const [rawContent, setRawContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"form" | "raw">("form");

  useEffect(() => {
    if (!tab) { setFields({}); setRawContent(""); return; }
    setLoading(true);
    readTydContent(tab.path)
      .then((c) => { setRawContent(c); setFields(parseTyd(c)); updateTabContent(tab.id, c); })
      .catch((e) => addConsoleLog(`ERROR: ${e}`))
      .finally(() => setLoading(false));
  }, [tab?.id, tab?.path]);

  const handleSave = useCallback(async () => {
    if (!tab) return;
    setSaving(true);
    try {
      const content = viewMode === "raw" ? rawContent : (() => {
        const rootKey = Object.keys(fields)[0] || "SoftwareType";
        const rv = fields[rootKey];
        return typeof rv === "object" && rv !== null && !Array.isArray(rv)
          ? `${rootKey}\n{\n${tydFromFields(rv, 1)}\n}`
          : tydFromFields(fields);
      })();
      await writeTydFile(tab.path, content);
      addConsoleLog(`Saved ${tab.name}`);
      markTabSaved(tab.id);
      if (modPath) { const t = await listModTree(modPath); setModTree(t); }
    } catch (e) { addConsoleLog(`ERROR saving: ${e}`); }
    setSaving(false);
  }, [tab, fields, rawContent, viewMode, addConsoleLog, markTabSaved, modPath, setModTree]);

  if (!tab) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <FileTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-700" />
          <p className="text-lg">Select a file to edit</p>
          <p className="text-sm text-gray-700 mt-1">Choose a file from the left panel</p>
        </div>
      </div>
    );
  }

  const rootKey = Object.keys(fields)[0] || "";
  const rootVal = typeof fields[rootKey] === "object" && fields[rootKey] !== null ? fields[rootKey] : fields;
  const setField = (key: string, val: string | number | boolean | string[]) => {
    const newRoot = { ...rootVal, [key]: val };
    setFields({ ...fields, [rootKey]: newRoot });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-white">{tab.name}</h2>
          {tab.modified && <span className="w-2 h-2 rounded-full bg-orange-400" />}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-800 rounded p-0.5 mr-2">
            <button onClick={() => setViewMode("form")} className={`px-2.5 py-1 rounded text-xs cursor-pointer ${viewMode === "form" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>Form</button>
            <button onClick={() => setViewMode("raw")} className={`px-2.5 py-1 rounded text-xs cursor-pointer ${viewMode === "raw" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"}`}>Raw</button>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 rounded-lg text-xs font-medium cursor-pointer">
            <SaveIcon className="w-3.5 h-3.5" />{saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-600"><p>Loading...</p></div>
      ) : viewMode === "raw" ? (
        <textarea value={rawContent} onChange={(e) => { setRawContent(e.target.value); updateTabContent(tab.id, e.target.value); }} className="flex-1 w-full bg-gray-950 text-gray-300 font-mono text-sm p-4 resize-none focus:outline-none" spellCheck={false} />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-5">
            {contentType === "softwareTypes" && (
              <>
                <Section title="Basic Info">
                  <Input label="Name" value={rootVal?.Name ?? ""} onChange={(v: string) => setField("Name", v)} />
                  <Input label="Description" value={rootVal?.Description ?? ""} textarea onChange={(v: string) => setField("Description", v)} />
                  <div className="grid grid-cols-3 gap-3">
                    <Input label="Optimal Dev Time" type="number" value={rootVal?.OptimalDevTime ?? 30} onChange={(v: string) => setField("OptimalDevTime", Number(v))} />
                    <Input label="Random" type="number" step="0.1" value={rootVal?.Random ?? 0} onChange={(v: string) => setField("Random", Number(v))} />
                    <Input label="Ideal Price" type="number" value={rootVal?.IdealPrice ?? 0} onChange={(v: string) => setField("IdealPrice", Number(v))} />
                  </div>
                </Section>
                <Section title="Submarkets">
                  <div className="grid grid-cols-3 gap-3">
                    {(Array.isArray(rootVal?.SubmarketNames) ? rootVal.SubmarketNames : ["", "", ""]).map((s: string, i: number) => (
                      <Input key={i} label={`Submarket ${i + 1}`} value={s ?? ""} onChange={(v: string) => {
                        const arr = [...(Array.isArray(rootVal?.SubmarketNames) ? rootVal.SubmarketNames : ["", "", ""])];
                        arr[i] = v;
                        setField("SubmarketNames", arr);
                      }} />
                    ))}
                  </div>
                </Section>
              </>
            )}
            {contentType === "companyTypes" && (
              <Section title="Company Type">
                <Input label="Specialization" value={rootVal?.Specialization ?? ""} onChange={(v: string) => setField("Specialization", v)} />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Per Year" type="number" step="0.1" value={rootVal?.PerYear ?? 0.2} onChange={(v: string) => setField("PerYear", Number(v))} />
                  <Input label="Min" type="number" value={rootVal?.Min ?? 2} onChange={(v: string) => setField("Min", Number(v))} />
                  <Input label="Max" type="number" value={rootVal?.Max ?? 4} onChange={(v: string) => setField("Max", Number(v))} />
                </div>
              </Section>
            )}
            {contentType === "meta" && (
              <Section title="Mod Metadata">
                <Input label="Name" value={rootVal?.Name ?? ""} onChange={(v: string) => setField("Name", v)} />
                <Input label="Description" value={rootVal?.Description ?? ""} textarea onChange={(v: string) => setField("Description", v)} />
                <Input label="Author" value={rootVal?.Author ?? ""} onChange={(v: string) => setField("Author", v)} />
              </Section>
            )}
            {contentType === "personalities" && (
              <Section title="Personalities">
                <p className="text-xs text-gray-500">Personality editing uses raw mode. Switch to Raw to edit.</p>
              </Section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-800">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", textarea, step }: {
  label: string; value: string | number | boolean;
  onChange: (v: string) => void; type?: string; textarea?: boolean; step?: string;
}) {
  const cls = "w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none";
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {textarea ? (
        <textarea className={`${cls} h-20 resize-none`} value={String(value)} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} type={type} step={step} value={String(value)} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
