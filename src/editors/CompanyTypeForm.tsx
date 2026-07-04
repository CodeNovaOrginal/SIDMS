interface CompanyTypeData {
  specialization: string;
  perYear: number;
  min: number;
  max: number;
  types: { software: string; chance: number; force: boolean }[];
}

export function CompanyTypeForm({ data, onChange }: { data: CompanyTypeData; onChange: (d: CompanyTypeData) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Specialization" value={data.specialization} onChange={(v) => onChange({ ...data, specialization: v })} />
      <div className="grid grid-cols-3 gap-3">
        <Field label="Per Year" type="number" step="0.1" value={data.perYear} onChange={(v) => onChange({ ...data, perYear: Number(v) })} />
        <Field label="Min" type="number" value={data.min} onChange={(v) => onChange({ ...data, min: Number(v) })} />
        <Field label="Max" type="number" value={data.max} onChange={(v) => onChange({ ...data, max: Number(v) })} />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-2">Product Types</label>
        {data.types.map((t, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input value={t.software} onChange={(e) => { const types = [...data.types]; types[i] = { ...types[i], software: e.target.value }; onChange({ ...data, types }); }} className="flex-1 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none" placeholder="Software name" />
            <input type="number" step="0.1" value={t.chance} onChange={(e) => { const types = [...data.types]; types[i] = { ...types[i], chance: Number(e.target.value) }; onChange({ ...data, types }); }} className="w-16 bg-gray-900 border border-gray-700 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none" />
            <button onClick={() => { const types = [...data.types]; types.splice(i, 1); onChange({ ...data, types }); }} className="text-red-400 text-xs">×</button>
          </div>
        ))}
        <button onClick={() => onChange({ ...data, types: [...data.types, { software: "", chance: 1, force: false }] })} className="text-xs text-gray-500 hover:text-gray-300">+ Add Type</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", step }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; step?: string }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none" type={type} step={step} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
