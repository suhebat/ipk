export default function AdminFooter() {
  return (
    <footer className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
      <div>
        Hak Cipta &copy; {new Date().getFullYear()}{" "}
        <span className="font-bold text-[#b8860b]">
          Pusdatin Kementerian Kebudayaan
        </span>
      </div>
      <div className="uppercase tracking-wider text-[10px] text-zinc-400 font-medium">
        Sistem Manajemen IPK v1.1
      </div>
    </footer>
  );
}