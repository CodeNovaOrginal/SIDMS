import { useState } from "react";

interface Category {
  name: string;
  description: string;
  popularity: number;
  retention: number;
  submarkets: [number, number, number];
  timeScale: number;
  iterative: number;
}

interface SubFeature {
  name: string;
  description: string;
  level: number;
  devTime: number;
  submarkets: [number, number, number];
  codeArt: number;
}

interface SpecFeature {
  name: string;
  spec: string;
  description: string;
  devTime: number;
  codeArt: number;
  submarkets: [number, number, number];
  features: SubFeature[];
}

interface SoftwareTypeData {
  name: string;
  description: string;
  categories: Category[];
  submarketNames: [string, string, string];
  optimalDevTime: number;
  random: number;
  idealPrice: number;
  features: SpecFeature[];
}

export function SoftwareTypeForm({ data, onChange }: { data: SoftwareTypeData; onChange: (d: SoftwareTypeData) => void }) {
  const [activeSection, setActiveSection] = useState<"basic" | "categories" | "features">("basic");

  const update = (patch: Partial<SoftwareTypeData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
        {(["basic", "categories", "features"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              activeSection === s ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {s === "basic" ? "Basic Info" : s === "categories" ? "Categories" : "Features"}
          </button>
        ))}
      </div>

      {activeSection === "basic" && (
        <div className="space-y-4">
          <Field label="Name" value={data.name} onChange={(v) => update({ name: v })} />
          <Field label="Description" value={data.description} textarea onChange={(v) => update({ description: v })} />
          <Field label="Optimal Dev Time" type="number" value={data.optimalDevTime} onChange={(v) => update({ optimalDevTime: Number(v) })} />
          <Field label="Random" type="number" step="0.1" value={data.random} onChange={(v) => update({ random: Number(v) })} />
          <Field label="Ideal Price" type="number" value={data.idealPrice} onChange={(v) => update({ idealPrice: Number(v) })} />
          <div className="grid grid-cols-3 gap-3">
            <Field label="Submarket 1" value={data.submarketNames[0]} onChange={(v) => { const n = [...data.submarketNames]; n[0] = v; update({ submarketNames: n as [string, string, string] }); }} />
            <Field label="Submarket 2" value={data.submarketNames[1]} onChange={(v) => { const n = [...data.submarketNames]; n[1] = v; update({ submarketNames: n as [string, string, string] }); }} />
            <Field label="Submarket 3" value={data.submarketNames[2]} onChange={(v) => { const n = [...data.submarketNames]; n[2] = v; update({ submarketNames: n as [string, string, string] }); }} />
          </div>
        </div>
      )}

      {activeSection === "categories" && (
        <div className="space-y-4">
          {data.categories.map((cat, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg p-4 space-y-3 border border-gray-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-300">Category {i + 1}</h4>
                <button onClick={() => { const c = [...data.categories]; c.splice(i, 1); update({ categories: c }); }} className="text-xs text-red-400 hover:text-red-300">Remove</button>
              </div>
              <Field label="Name" value={cat.name} onChange={(v) => { const c = [...data.categories]; c[i] = { ...c[i], name: v }; update({ categories: c }); }} />
              <Field label="Popularity" type="number" step="0.05" value={cat.popularity} onChange={(v) => { const c = [...data.categories]; c[i] = { ...c[i], popularity: Number(v) }; update({ categories: c }); }} />
              <Field label="Retention" type="number" value={cat.retention} onChange={(v) => { const c = [...data.categories]; c[i] = { ...c[i], retention: Number(v) }; update({ categories: c }); }} />
              <SubmarketField label="Submarkets" value={cat.submarkets} onChange={(v) => { const c = [...data.categories]; c[i] = { ...c[i], submarkets: v }; update({ categories: c }); }} />
            </div>
          ))}
          <button
            onClick={() => update({ categories: [...data.categories, { name: "", description: "", popularity: 0.5, retention: 24, submarkets: [1, 1, 1], timeScale: 1, iterative: 0.8 }] })}
            className="w-full py-2 border border-dashed border-gray-700 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
          >
            + Add Category
          </button>
        </div>
      )}

      {activeSection === "features" && (
        <div className="space-y-4">
          {data.features.map((feat, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg p-4 space-y-3 border border-gray-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-300">{feat.name || `Feature ${i + 1}`}</h4>
                <button onClick={() => { const f = [...data.features]; f.splice(i, 1); update({ features: f }); }} className="text-xs text-red-400 hover:text-red-300">Remove</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name" value={feat.name} onChange={(v) => { const f = [...data.features]; f[i] = { ...f[i], name: v }; update({ features: f }); }} />
                <Field label="Spec" value={feat.spec} onChange={(v) => { const f = [...data.features]; f[i] = { ...f[i], spec: v }; update({ features: f }); }} />
              </div>
              <Field label="Description" value={feat.description} textarea onChange={(v) => { const f = [...data.features]; f[i] = { ...f[i], description: v }; update({ features: f }); }} />
              <div className="grid grid-cols-3 gap-3">
                <Field label="Dev Time" type="number" value={feat.devTime} onChange={(v) => { const f = [...data.features]; f[i] = { ...f[i], devTime: Number(v) }; update({ features: f }); }} />
                <Field label="Code/Art" type="number" step="0.1" value={feat.codeArt} onChange={(v) => { const f = [...data.features]; f[i] = { ...f[i], codeArt: Number(v) }; update({ features: f }); }} />
              </div>
              <SubmarketField label="Submarkets" value={feat.submarkets} onChange={(v) => { const f = [...data.features]; f[i] = { ...f[i], submarkets: v }; update({ features: f }); }} />
            </div>
          ))}
          <button
            onClick={() => update({ features: [...data.features, { name: "", spec: "", description: "", devTime: 0, codeArt: 1, submarkets: [1, 1, 1], features: [] }] })}
            className="w-full py-2 border border-dashed border-gray-700 rounded-lg text-xs text-gray-500 hover:text-gray-300 hover:border-gray-500 transition-colors"
          >
            + Add Feature
          </button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", textarea, step }: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; textarea?: boolean; step?: string;
}) {
  const cls = "w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none";
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {textarea ? (
        <textarea className={`${cls} h-20 resize-none`} value={value as string} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} type={type} step={step} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function SubmarketField({ label, value, onChange }: {
  label: string; value: [number, number, number]; onChange: (v: [number, number, number]) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="grid grid-cols-3 gap-2">
        {value.map((v, i) => (
          <input
            key={i}
            type="number"
            className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-white text-xs focus:border-blue-500 focus:outline-none"
            value={v}
            onChange={(e) => { const n = [...value] as [number, number, number]; n[i] = Number(e.target.value); onChange(n); }}
          />
        ))}
      </div>
    </div>
  );
}
