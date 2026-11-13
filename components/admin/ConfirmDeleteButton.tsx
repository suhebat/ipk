"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, TriangleAlert } from "lucide-react";

type Props = {
  /** Label singkat di modal, mis. nomor permohonan / nama */
  itemLabel: string;
  /** Teks jenis data: "log unduhan" | "permohonan data" | "surat masuk" */
  entityLabel: string;
  /** Server Action yang menerima FormData berisi field "id" */
  deleteAction: (formData: FormData) => Promise<void>;
  id: string | number;
};

export default function ConfirmDeleteButton({
  itemLabel,
  entityLabel,
  deleteAction,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const onConfirm = () => {
    const fd = new FormData();
    fd.set("id", String(id));
    startTransition(async () => {
      await deleteAction(fd);
      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Hapus"
        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
      >
        <Trash2 size={15} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          onClick={() => !pending && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-red-500/10 text-red-600 shrink-0">
                <TriangleAlert size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Hapus {entityLabel}?
                </h3>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                  Data{" "}
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {itemLabel}
                  </span>{" "}
                  akan dihapus permanen dari database. Tindakan ini tidak dapat
                  dibatalkan.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                disabled={pending}
                onClick={() => setOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={onConfirm}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Menghapus…
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Ya, hapus
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
