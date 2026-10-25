"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCheck, CircleAlert, X } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { ApplicationDetail } from "@/components/applications/application-detail";
import { AIReviewPanel } from "@/components/ai-review/ai-review-panel";
import { seededApplications } from "@/lib/mock-data";
import type { Application } from "@/types/application";

const STORAGE_KEY = "janseva-demo-applications";

export default function ApplicationPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="आवेदन">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            लोड हो रहा है…
          </div>
        </AppShell>
      }
    >
      <ApplicationPageContent />
    </Suspense>
  );
}

function ApplicationPageContent() {
  const params = useParams<{ id: string }>();
  const [applications, setApplications] = useState<Application[]>(seededApplications);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [decision, setDecision] = useState<"approved" | "rejected" | "returned" | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // Hydrate from browser-only demo storage after the server render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setApplications(JSON.parse(saved) as Application[]);
      }
    } catch {
      setApplications(seededApplications);
    }
  }, []);

  const application = useMemo(
    () => applications.find((item) => item.id === params.id) ?? applications[0],
    [applications, params.id],
  );

  const persist = (next: Application[]) => {
    setApplications(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore save errors
    }
  };

  const saveDecision = (type: "approved" | "rejected" | "returned") => {
    if (!application || !decisionReason.trim()) {
      setStatusNotice("कृपया निर्णय कारण लिखें।");
      return;
    }

    const nextApplication: Application = {
      ...application,
      status:
        type === "approved" ? "approved" : type === "rejected" ? "rejected" : "returned",
      decisions: [
        {
          id: `decision-${Date.now()}`,
          type,
          officerName: "अभिषेक शर्मा",
          officerId: "officer-101",
          reason: decisionReason,
          timestamp: new Date().toISOString(),
        },
        ...application.decisions,
      ],
      timeline: [
        {
          id: `event-${Date.now()}`,
          type: "decision",
          title: type === "approved" ? "स्वीकृति" : type === "rejected" ? "अस्वीकृति" : "सुधार हेतु लौटाया",
          description: decisionReason,
          timestamp: new Date().toISOString(),
        },
        ...application.timeline,
      ],
    };

    const next = applications.map((item) => (item.id === application.id ? nextApplication : item));
    persist(next);
    setStatusNotice("निर्णय सफलतापूर्वक दर्ज किया गया।");
    setDecision(null);
    setDecisionReason("");
    setShowDialog(false);
  };

  if (!application) {
    return (
      <AppShell title="आवेदन नहीं मिला">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          अनुरोधित आवेदन उपलब्ध नहीं है।
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={`आवेदन ${application.id}`}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <ArrowLeft className="h-4 w-4" />
              वापस
            </Link>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">आवेदन</div>
              <div className="text-xl font-semibold text-slate-900">{application.id}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setDecision("approved");
                setDecisionReason("सभी दस्तावेज़ पूर्ण है और सत्यापन पूरा है।");
                setShowDialog(true);
              }}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500"
            >
              स्वीकृत करें
            </button>
            <button
              type="button"
              onClick={() => {
                setDecision("rejected");
                setDecisionReason("");
                setShowDialog(true);
              }}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-500"
            >
              अस्वीकृत करें
            </button>
            <button
              type="button"
              onClick={() => {
                setDecision("returned");
                setDecisionReason("");
                setShowDialog(true);
              }}
              className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-400"
            >
              सुधार हेतु वापस भेजें
            </button>
          </div>
        </div>

        {statusNotice && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {statusNotice}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <ApplicationDetail
            initialApplication={application}
            onUpdate={(next) => {
              const nextList = applications.map((item) => (item.id === application.id ? next : item));
              persist(nextList);
            }}
          />
          <AIReviewPanel application={application} />
        </div>
      </div>

      {showDialog && decision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                {decision === "approved" ? <CheckCheck className="h-5 w-5 text-emerald-600" /> : decision === "rejected" ? <X className="h-5 w-5 text-red-600" /> : <CircleAlert className="h-5 w-5 text-amber-600" />}
                {decision === "approved" ? "स्वीकृति की पुष्टि" : decision === "rejected" ? "अस्वीकृति की पुष्टि" : "सुधार हेतु लौटाना"}
              </div>
              <button type="button" onClick={() => setShowDialog(false)} className="rounded-lg border border-slate-200 p-2 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                {decision === "approved" ? "स्वीकृति का कारण" : decision === "rejected" ? "अस्वीकृति का कारण" : "सुधार के लिए आवश्यक परिवर्तन"}
                <textarea
                  value={decisionReason}
                  onChange={(event) => setDecisionReason(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-slate-300 focus:bg-white"
                  placeholder={decision === "returned" ? "दस्तावेज़, सत्यापन, या सूचना का विवरण लिखें" : "कारण लिखें"}
                />
              </label>

              <div className="rounded-xl border border-amber-100 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                यह निर्णय केवल मानव अधिकारी द्वारा लिया जाएगा। AI का सुझाव सहायता के रूप में है, निर्णय नहीं।
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowDialog(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700">
                  रद्द करें
                </button>
                <button
                  type="button"
                  onClick={() => saveDecision(decision)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium text-white ${
                    decision === "approved" ? "bg-emerald-600 hover:bg-emerald-500" : decision === "rejected" ? "bg-red-600 hover:bg-red-500" : "bg-amber-500 hover:bg-amber-400"
                  }`}
                >
                  {decision === "approved" ? "सही, स्वीकृत करें" : decision === "rejected" ? "सही, अस्वीकृत करें" : "सही, वापस भेजें"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
