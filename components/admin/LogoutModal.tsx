"use client";

import { useState } from "react";
import { LogOut, AlertTriangle, Loader2, X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  userName?: string;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  userName = "Admin",
}: LogoutModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Gelap dengan Blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-center">
        {/* Tombol Close silang di pojok kanan atas */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
          aria-label="Tutup"
        >
          <X size={18} />
        </button>

        {/* Lingkaran Ikon Peringatan dengan Efek Glow */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 ring-8 ring-red-500/5">
          <LogOut size={28} className="translate-x-0.5" />
        </div>

        {/* Judul & Deskripsi */}
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1.5">
          Keluar dari Sistem?
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 px-2">
          Hai <strong className="text-zinc-700 dark:text-zinc-200">{userName}</strong>, sesi kerja Anda akan diakhiri. Pastikan semua perubahan data telah Anda simpan.
        </p>

        {/* Tombol Aksi */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-sm shadow-red-600/30 transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <LogOut size={15} />
                <span>Ya, Keluar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}