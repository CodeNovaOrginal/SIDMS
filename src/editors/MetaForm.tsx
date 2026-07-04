interface MetaData {
  name: string;
  description: string;
  author: string;
  version: string;
}

export function MetaForm({ data, onChange }: { data: MetaData; onChange: (d: MetaData) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Mod Name" value={data.name} onChange={(v) => onChange({ ...data, name: v })} />
      <Field label="Description" value={data.description} textarea onChange={(v) => onChange({ ...data, description: v })} />
      <Field label="Author" value={data.author} onChange={(v) => onChange({ ...data, author: v })} />
      <Field label="Version" value={data.version} onChange={(v) => onChange({ ...data, version: v })} />
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const cls = "w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none";
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {textarea ? (
        <textarea className={`${cls} h-24 resize-none`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
