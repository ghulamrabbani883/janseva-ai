"use client";

import { AlertTriangle, ArrowRight, CheckCircle2, FileWarning, ShieldCheck, Sparkles } from "lucide-react";
import type { Application } from "@/types/application";
import { generateRuleBasedReview } from "@/lib/review-engine";

export function AIReviewPanel({ application }: { application: Application }) {
  const review = generateRuleBasedReview(application);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xl font-semibold text-slate-900">AI समीक्षा सहायक</div>
            <div className="text-sm text-slate-500">{review.mode === "rule-based" ? "रूल-आधारित सहायता" : "LLM सहायता"}</div>
          </div>
        </div>
        <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          संरचित डेटा पर आधारित
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            आवेदन का सारांश
          </div>
          <p className="text-sm leading-6 text-slate-700">{review.summary}</p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <FileWarning className="h-4 w-4 text-amber-600" />
              आवश्यक दस्तावेज़
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {review.requiredDocuments.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              विसंगतियाँ
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {review.inconsistencies.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              सत्यापन के बिंदु
            </div>
            <ul className="space-y-2 text-sm text-slate-700">
              {review.verificationPoints.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ArrowRight className="h-4 w-4 text-violet-600" />
              सुझाया गया अगला कदम
            </div>
            <div className="text-sm font-medium text-violet-700">{review.nextAction}</div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 p-4">
          <div className="mb-3 text-sm font-semibold text-slate-700">सुझाव का कारण</div>
          <ul className="space-y-2 text-sm text-slate-700">
            {review.reasons.map((reason) => (
              <li key={reason} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-700" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          AI द्वारा दिए गए सुझाव केवल निर्णय में सहायता के लिए हैं। अंतिम निर्णय संबंधित अधिकारी का होगा।
        </div>
      </div>
    </div>
  );
}
