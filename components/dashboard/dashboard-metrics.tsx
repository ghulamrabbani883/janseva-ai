import type { Application } from "@/types/application";

function metricCard(title: string, value: string | number, accent: string) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className={`text-3xl font-bold ${accent}`}>{value}</div>
        <div className={`h-2.5 w-2.5 rounded-full ${accent.replace("text-", "bg-")}`} />
      </div>
    </div>
  );
}

export function DashboardMetrics({ applications }: { applications: Application[] }) {
  const referenceDate = new Date("2026-10-25T12:00:00+05:30");
  const pending = applications.filter((application) => application.status === "pending").length;
  const todayReceived = applications.filter((application) => {
    const date = new Date(application.submittedAt);
    return date.toDateString() === referenceDate.toDateString();
  }).length;
  const verificationRequired = applications.filter((application) =>
    application.documents.some((document) => document.status === "pending_verification" || document.status === "needs_clarification"),
  ).length;
  const overdue = applications.filter((application) => new Date(application.reviewDeadline) < referenceDate).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricCard("कुल लंबित आवेदन", pending, "text-slate-900")}
      {metricCard("आज प्राप्त आवेदन", todayReceived, "text-emerald-600")}
      {metricCard("सत्यापन आवश्यक", verificationRequired, "text-amber-600")}
      {metricCard("समय-सीमा पार आवेदन", overdue, "text-red-600")}
    </div>
  );
}
