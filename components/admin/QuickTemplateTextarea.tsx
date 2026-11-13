"use client";

import { useState } from "react";

type TemplateOption = {
  label: string;
  text: string;
};

type Props = {
  name: string;
  initialValue?: string;
  placeholder?: string;
  templates: TemplateOption[];
};

export default function QuickTemplateTextarea({
  name,
  initialValue = "",
  placeholder = "Tulis tanggapan atau pilih template cepat di atas...",
  templates,
}: Props) {
  const [value, setValue] = useState(initialValue);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = templates.find((t) => t.label === e.target.value);
    if (selected && selected.text) {
      setValue(selected.text);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Catatan Tanggapan / Balasan
        </label>
        <select
          onChange={handleSelect}
          defaultValue=""
          className="text-[11px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#b8860b] cursor-pointer"
        >
          <option value="" disabled>
            ⚡ Pilih Template Cepat
          </option>
          {templates.map((t) => (
            <option key={t.label} value={t.label}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <textarea
        name={name}
        rows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-zinc-900 dark:text-zinc-100 resize-y focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
      />
    </div>
  );
}