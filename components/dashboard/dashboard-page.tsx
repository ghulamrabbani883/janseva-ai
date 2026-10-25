"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Filter, Search, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { ApplicationTable } from "@/components/dashboard/application-table";
import { seededApplications } from "@/lib/mock-data";
import { getApplicationPriority } from "@/lib/review-engine";
import type { Application } from "@/types/application";

const STORAGE_KEY = "janseva-demo-applications";
const REFERENCE_DATE = new Date("2026-10-25T12:00:00+05:30");

type DashboardView = "dashboard" | "applications" | "pending" | "verification" | "history";

const viewTitles: Record<DashboardView, string> = {
  dashboard: "अधिकारी डैशबोर्ड",
  applications: "सभी आवेदन",
  pending: "मेरे पास लंबित",
  verification: "दस्तावेज़ सत्यापन",
  history: "निर्णय इतिहास",
};

export function DashboardPage({ view }: { view: DashboardView }) {
  const [allApplications, setAllApplications] = useState<Application[]>(seededApplications);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("urgency");
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Hydrate from browser-only demo storage after the server render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAllApplications(JSON.parse(saved) as Application[]);
      } else {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seededApplications));
      }
    } catch {
      setAllApplications(seededApplications);
    }
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(allApplications));
    } catch {
      // Ignore storage failures in this demo.
    }
  }, [allApplications, storageLoaded]);

  const viewApplications = useMemo(() => {
    if (view === "pending") {
      return allApplications.filter((application) =>
        ["pending", "under_review", "returned"].includes(application.status),
      );
    }
    if (view === "verification") {
      return allApplications.filter((application) =>
        application.documents.some((document) =>
          ["missing", "pending_verification", "needs_clarification"].includes(document.status),
        ),
      );
    }
    if (view === "history") {
      return allApplications.filter((application) =>
        ["approved", "rejected"].includes(application.status),
      );
    }
    return allApplications;
  }, [allApplications, view]);

  const filteredApplications = useMemo(() => {
    const textQuery = query.trim().toLowerCase();
    const filtered = viewApplications.filter((application) => {
      const matchesText =
        !textQuery ||
        application.id.toLowerCase().includes(textQuery) ||
        application.applicant.name.toLowerCase().includes(textQuery);
      const matchesStatus = status === "all" || application.status === status;
      const priorityLevel = getApplicationPriority(application).level;
      const matchesPriority = priority === "all" || priorityLevel === priority;
      return matchesText && matchesStatus && matchesPriority;
    });

    return [...filtered].sort((first, second) => {
      if (sort === "date") {
        return new Date(second.submittedAt).getTime() - new Date(first.submittedAt).getTime();
      }
      return getApplicationPriority(second).score - getApplicationPriority(first).score;
    });
  }, [priority, query, sort, status, viewApplications]);

  return (
    <AppShell title={viewTitles[view]}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-wide text-slate-500">प्रबंधन पैनल</div>
            <h1 className="text-2xl font-semibold text-slate-900">{viewTitles[view]}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
            <ShieldAlert className="h-4 w-4" />
            प्रदर्शन मोड: केवल डेमो
          </div>
        </div>

        {view === "dashboard" && <DashboardMetrics applications={allApplications} />}

        {view === "dashboard" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Filter className="h-5 w-5 text-slate-700" />
              प्राथमिकता कतार
            </div>
            {filteredApplications.length > 0 ? (
              <div className="space-y-3">
                {filteredApplications.slice(0, 5).map((application) => {
                  const priorityMeta = getApplicationPriority(application);
                  const overdue = new Date(application.reviewDeadline) < REFERENCE_DATE;
                  const missingCount = application.documents.filter((document) =>
                    ["missing", "needs_clarification"].includes(document.status),
                  ).length;

                  return (
                    <div key={application.id} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-slate-900">{application.id}</div>
                        <div className="text-sm text-slate-600">{application.applicant.name} • {application.applicant.village}</div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                        <span className="rounded-full bg-slate-200 px-2 py-1">{new Date(application.submittedAt).toLocaleDateString("hi-IN")}</span>
                        <span className="rounded-full bg-slate-200 px-2 py-1">{application.status}</span>
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">{priorityMeta.label}</span>
                        <span className={`rounded-full px-2 py-1 ${overdue ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {overdue ? "समय-सीमा पार" : "समय शेष"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${overdue ? "text-red-500" : "text-amber-500"}`} />
                          {missingCount} दस्तावेज़
                        </div>
                        <a href={`/applications/${application.id}`} className="font-medium text-slate-900">खोलें →</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-slate-600">
                कोई आवेदन इस फ़िल्टर के अनुरूप नहीं है।
              </div>
            )}
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Search className="h-5 w-5 text-slate-700" />
            {view === "verification" ? "सत्यापन के लिए आवेदन" : view === "history" ? "दर्ज निर्णय" : "आवेदन सूची"}
          </div>
          <DashboardFilters
            query={query}
            status={status}
            priority={priority}
            sort={sort}
            onQueryChange={setQuery}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
            onSortChange={setSort}
            onReset={() => {
              setQuery("");
              setStatus("all");
              setPriority("all");
              setSort("urgency");
            }}
          />
          {filteredApplications.length > 0 ? (
            <ApplicationTable applications={filteredApplications} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center text-slate-600">
              कोई परिणाम नहीं मिला। जांचें कि फ़िल्टर सही हैं या रीसेट करें।
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
