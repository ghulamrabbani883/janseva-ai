"use client";

import Link from "next/link";
import { Bell, ChevronRight, FileCheck2, LayoutDashboard, Menu, ShieldCheck, Users, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "डैशबोर्ड", icon: LayoutDashboard },
  { href: "/applications", label: "सभी आवेदन", icon: Users },
  { href: "/pending", label: "मेरे पास लंबित", icon: ShieldCheck },
  { href: "/verification", label: "दस्तावेज़ सत्यापन", icon: FileCheck2 },
  { href: "/history", label: "निर्णय इतिहास", icon: ChevronRight },
];

export function AppShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-slate-900 text-slate-100 transition-transform duration-200 md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="flex items-center gap-3 border-b border-slate-700 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-xl text-emerald-300">
              J
            </div>
            <div>
              <div className="text-base font-semibold">JanSeva AI</div>
              <div className="text-xs text-slate-400">सरकारी समीक्षा</div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-700 p-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-800/80 p-3">
              <div>
                <div className="text-xs text-slate-400">प्रदर्शन मोड</div>
                <div className="text-sm font-medium text-emerald-300">नोट: केवल डेमो</div>
              </div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden"
                  onClick={() => setSidebarOpen((current) => !current)}
                  aria-label="Toggle navigation"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">JanSeva AI</div>
                  <div className="text-lg font-semibold text-slate-800">{title}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setNotificationOpen((current) => !current)}
                  className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                </button>

                <div className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 md:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    AS
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">अभिषेक शर्मा</div>
                    <div className="text-xs text-slate-500">वरिष्ठ अधिकारी</div>
                  </div>
                </div>
              </div>
            </div>

            {notificationOpen && (
              <div className="border-t border-slate-200 bg-white px-4 py-3 md:px-6">
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  3 नई समीक्षा सूचनाएँ: 2 दस्तावेज़ सत्यापन, 1 निर्णय की प्रतीक्षा।
                </div>
              </div>
            )}
          </header>

          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
