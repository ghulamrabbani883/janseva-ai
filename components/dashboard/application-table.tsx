"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, AlertTriangle, Clock3 } from "lucide-react";
import type { Application } from "@/types/application";
import { getApplicationPriority } from "@/lib/review-engine";

export function ApplicationTable({ applications }: { applications: Application[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">आवेदन</th>
              <th className="px-4 py-3 font-medium">आवेदक</th>
              <th className="px-4 py-3 font-medium">गाँव/वार्ड</th>
              <th className="px-4 py-3 font-medium">प्रस्तुत तिथि</th>
              <th className="px-4 py-3 font-medium">स्थिति</th>
              <th className="px-4 py-3 font-medium">दस्तावेज़</th>
              <th className="px-4 py-3 font-medium">प्राथमिकता</th>
              <th className="px-4 py-3 font-medium">कार्य</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {applications.map((application) => {
              const priority = getApplicationPriority(application);
              const missingCount = application.documents.filter(
                (document) => document.status === "missing" || document.status === "needs_clarification",
              ).length;
              const deadline = new Date(application.reviewDeadline);
              const today = new Date("2026-10-25T12:00:00+05:30");
              const overdueDays = Math.max(0, Math.ceil((today.getTime() - deadline.getTime()) / 86400000));

              return (
                <tr key={application.id} className="align-middle">
                  <td className="px-4 py-3 font-semibold text-slate-800">{application.id}</td>
                  <td className="px-4 py-3">{application.applicant.name}</td>
                  <td className="px-4 py-3">{application.applicant.village}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(application.submittedAt).toLocaleDateString("hi-IN")}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {application.status === "pending" ? "लंबित" : application.status === "under_review" ? "समीक्षा" : application.status === "returned" ? "सुधार" : application.status === "approved" ? "स्वीकृत" : "अस्वीकृत"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{missingCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          priority.level === "critical"
                            ? "bg-red-100 text-red-700"
                            : priority.level === "high"
                              ? "bg-amber-100 text-amber-700"
                              : priority.level === "medium"
                                ? "bg-sky-100 text-sky-700"
                                : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {priority.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      {overdueDays > 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">{overdueDays} दिन देरी</span>
                        </>
                      ) : (
                        <>
                          <Clock3 className="h-4 w-4 text-emerald-500" />
                          <span>{priority.reason}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/applications/${application.id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
                    >
                      खोलें
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
