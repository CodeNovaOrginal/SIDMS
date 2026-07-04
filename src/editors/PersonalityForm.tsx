import { useState } from "react";

interface PersonalityData {
  name: string;
  traits: string[];
  expression: string;
  relationships: Record<string, number>;
}

export function PersonalityForm({ data, onChange }: { data: PersonalityData; onChange: (d: PersonalityData) => void }) {
  const [newRelName, setNewRelName] = useState("");
  const [newRelValue, setNewRelValue] = useState(1);

  const TRAITS = [
    "FastLearner", "Independent", "BigBrain", "Humble", "Capacitor", "WalkItOff",
    "ThisIsFine", "Skyscraper", "Sunshine", "RGBThumb", "Stressed", "Hypochondriac",
    "SlowEater", "NervousBladder", "BumLeg", "Forgetful", "Cupholder", "NeatFreak",
    "NightOwl", "BornLeader", "FirmwareInc", "SuperFocus", "Unphased", "Detached",
  ];

  const EXPRESSIONS = ["Smile", "Frown", "Arrogant", "Neutral"];

  return (
    <div className="space-y-4">
      <Field label="Name" value={data.name} onChange={(v) => onChange({ ...data, name: v })} />

      <div>
        <label className="block text-xs text-gray-500 mb-1">Traits</label>
        <div className="flex flex-wrap gap-1.5">
          {TRAITS.map((t) => (
            <button
              key={t}
              onClick={() => {
                const traits = data.traits.includes(t)
                  ? data.traits.filter((x) => x !== t)
                  : [...data.traits, t];
                onChange({ ...data, traits });
              }}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                data.traits.includes(t)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-500 hover:text-gray-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Expression</label>
        <div className="flex gap-2">
          {EXPRESSIONS.map((e) => (
            <button
              key={e}
              onClick={() => onChange({ ...data, expression: e })}
              className={`px-3 py-1.5 rounded text-xs transition-colors ${
                data.expression === e
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-500 hover:text-gray-300"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-2">Relationships</label>
        <div className="space-y-1.5">
          {Object.entries(data.relationships).map(([name, value]) => (
            <div key={name} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-24 truncate">{name}</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.25"
                value={value}
                onChange={(e) => onChange({ ...data, relationships: { ...data.relationships, [name]: Number(e.target.value) } })}
                className="flex-1 h-1"
              />
              <span className="text-xs text-gray-500 w-10 text-right">{value}</span>
              <button onClick={() => { const r = { ...data.relationships }; delete r[name]; onChange({ ...data, relationships: r }); }} className="text-red-400 hover:text-red-300 text-xs">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input value={newRelName} onChange={(e) => setNewRelName(e.target.value)} placeholder="Personality name" className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none" />
          <input type="number" min="-1" max="1" step="0.25" value={newRelValue} onChange={(e) => setNewRelValue(Number(e.target.value))} className="w-20 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:border-blue-500 focus:outline-none" />
          <button onClick={() => { if (newRelName) { onChange({ ...data, relationships: { ...data.relationships, [newRelName]: newRelValue } }); setNewRelName(""); } }} className="px-2 py-1 bg-blue-600 rounded text-xs text-white">+</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
