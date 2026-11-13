"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, RotateCcw, UserCheck, ChevronDown } from "lucide-react";

const SIMULATION_ROLES = [
  { value: "superadmin", label: "Super Admin (Penuh)" },
  { value: "data_admin", label: "Pengelola Data" },
  { value: "data_verifikator", label: "Verifikator Data" },
  { value: "content_admin", label: "Pengelola Konten" },
  { value: "service_admin", label: "Pengelola Layanan" },
  { value: "admin", label: "Administrator" },
];

type Props = {
  currentRole: string;
  isImpersonating?: boolean;
  realRole?: string;
};

export default function RoleSwitcherBar({ currentRole, isImpersonating, realRole }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Jangan render jika bukan Superadmin asli
  if (realRole !== "superadmin" && currentRole !== "superadmin") return null;

  async function handleSwitch(role: string) {
    try {
      setLoading(true);
      await fetch("/api/admin/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: role }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-2xl bg-zinc-900/95 dark:bg-zinc-800/95 text-white p-2.5 shadow-2xl border border-amber-500/40 backdrop-blur-md transition-all">
      <div className="flex items-center gap-2 pl-2 pr-1">
        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
          <ShieldAlert size={16} />
        </div>
        <div className="text-left text-xs leading-tight hidden sm:block">
          <div className="font-bold text-amber-400 flex items-center gap-1">
            Mode Simulasi Role
          </div>
          <div className="text-[10px] text-zinc-400">
            Melihat sebagai: <span className="text-white font-semibold capitalize">{currentRole.replace("_", " ")}</span>
          </div>
        </div>
      </div>

      {/* Dropdown Ganti Role Cepat */}
      <select
        value={currentRole}
        disabled={loading}
        onChange={(e) => handleSwitch(e.target.value)}
        className="rounded-xl bg-zinc-800 dark:bg-zinc-700 border border-zinc-700 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
      >
        {SIMULATION_ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>

      {/* Tombol Cepat Kembali ke Super Admin */}
      {isImpersonating && (
        <button
          type="button"
          disabled={loading}
          onClick={() => handleSwitch("reset")}
          className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-3 py-1.5 text-xs transition shadow-sm"
          title="Kembali ke wewenang penuh Super Admin"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}
    </div>
  );
}