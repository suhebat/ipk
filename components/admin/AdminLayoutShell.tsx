"use client";

import { useState } from "react";
import AdminHeader, { HeaderNotification } from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

type Props = {
  admin: {
    nama: string;
    username: string;
    role: string;
    isImpersonating?: boolean;
    realRole?: string;
  };
  countPermohonan: number;
  countSurat: number;
  recentNotif: HeaderNotification[];
  children: React.ReactNode;
};

export default function AdminLayoutShell({
  admin,
  countPermohonan,
  countSurat,
  recentNotif,
  children,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* 1. SIDEBAR DESKTOP - Beri w-64 agar flex container memberi ruang 256px untuk sidebar */}
      <div className="hidden md:block w-64 shrink-0 h-full">
        <AdminSidebar
          role={admin.role}
          countPermohonan={countPermohonan}
          countSurat={countSurat}
          isImpersonating={admin.isImpersonating}
          realRole={admin.realRole}
        />
      </div>

      {/* 2. SIDEBAR MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`relative z-10 h-full w-64 max-w-[80vw] shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <AdminSidebar
            role={admin.role}
            countPermohonan={countPermohonan}
            countSurat={countSurat}
            isImpersonating={admin.isImpersonating}
            realRole={admin.realRole}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* 3. KONTEN UTAMA */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <AdminHeader
          nama={admin.nama}
          username={admin.username}
          role={admin.role}
          countPermohonan={countPermohonan}
          countSurat={countSurat}
          recentNotif={recentNotif}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}