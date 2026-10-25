"use client";

import { useState } from "react";
import { AlertCircle, CheckCheck, CircleDashed, FileText, GanttChartSquare, UserRound, Wallet } from "lucide-react";
import type { Application, DocumentStatus } from "@/types/application";

const docStatusStyles: Record<DocumentStatus, string> = {
  submitted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  missing: "bg-red-50 text-red-700 border-red-200",
  pending_verification: "bg-amber-50 text-amber-700 border-amber-200",
  needs_clarification: "bg-sky-50 text-sky-700 border-sky-200",
};

const docStatusLabels: Record<DocumentStatus, string> = {
  submitted: "प्रस्तुत",
  missing: "अपूर्ण",
  pending_verification: "सत्यापन लंबित",
  needs_clarification: "स्पष्टीकरण आवश्यक",
};

export function ApplicationDetail({ initialApplication, onUpdate }: { initialApplication: Application; onUpdate: (next: Application) => void }) {
  const [application, setApplication] = useState(initialApplication);

  const updateDocumentStatus = (documentId: string, status: DocumentStatus) => {
    const next = {
      ...application,
      documents: application.documents.map((document) =>
        document.id === documentId ? { ...document, status } : document,
      ),
    };

    setApplication(next);
    onUpdate(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">आवेदक</div>
              <div className="text-xl font-semibold text-slate-900">{application.applicant.name}</div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">आवेदन ID</div>
              <div className="mt-1 font-semibold text-slate-900">{application.id}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">स्थिति</div>
              <div className="mt-1 font-semibold text-slate-900">{application.status}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">गाँव / वार्ड</div>
              <div className="mt-1 font-semibold text-slate-900">{application.applicant.village}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">प्रस्तुत तिथि</div>
              <div className="mt-1 font-semibold text-slate-900">{new Date(application.submittedAt).toLocaleDateString("hi-IN")}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">घोषित आय</div>
              <div className="mt-1 font-semibold text-slate-900">{application.incomeDetails.declaredAnnualIncome.toLocaleString("en-IN")} रुपये</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <div className="text-xs uppercase tracking-wide text-slate-500">रोज़गार</div>
              <div className="mt-1 font-semibold text-slate-900">{application.applicant.occupation}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-slate-500">आय-आधार</div>
              <div className="text-xl font-semibold text-slate-900">{application.incomeDetails.source}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span>घोषित वार्षिक आय</span>
              <strong>{application.incomeDetails.declaredAnnualIncome.toLocaleString("en-IN")}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span>दर्ज आय</span>
              <strong>{application.incomeDetails.reportedIncome?.toLocaleString("en-IN") ?? "-"}</strong>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <span>सत्यापन आय</span>
              <strong>{application.incomeDetails.verifierIncome?.toLocaleString("en-IN") ?? "-"}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <FileText className="h-5 w-5 text-slate-700" />
          दस्तावेज़ सत्यापन
        </div>

        <div className="space-y-3">
          {application.documents.map((document) => (
            <div key={document.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[1.4fr_0.9fr_1.5fr_auto] md:items-center">
              <div>
                <div className="font-medium text-slate-800">{document.name}</div>
                <div className="text-xs text-slate-500">{document.required ? "अनिवार्य" : "वैकल्पिक"}</div>
              </div>
              <div>
                <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${docStatusStyles[document.status]}`}>
                  {docStatusLabels[document.status]}
                </span>
              </div>
              <div className="text-sm text-slate-600">{document.reviewNotes}</div>
              <select
                value={document.status}
                onChange={(event) => updateDocumentStatus(document.id, event.target.value as DocumentStatus)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white"
                aria-label={`Update status for ${document.name}`}
              >
                <option value="submitted">प्रस्तुत</option>
                <option value="missing">अपूर्ण</option>
                <option value="pending_verification">सत्यापन लंबित</option>
                <option value="needs_clarification">स्पष्टीकरण आवश्यक</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <GanttChartSquare className="h-5 w-5 text-slate-700" />
          आवेदन टाइमलाइन
        </div>
        <div className="space-y-4">
          {application.timeline.map((event) => (
            <div key={event.id} className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                {event.type === "decision" ? <CheckCheck className="h-4 w-4" /> : event.type === "verification" ? <CircleDashed className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              </div>
              <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-800">{event.title}</div>
                  <div className="text-xs text-slate-500">{new Date(event.timestamp).toLocaleString("hi-IN")}</div>
                </div>
                <div className="mt-1 text-sm text-slate-600">{event.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
