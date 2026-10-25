"use client";

export function DashboardFilters({
  query,
  status,
  priority,
  sort,
  onQueryChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
  onReset,
}: {
  query: string;
  status: string;
  priority: string;
  sort: string;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}) {
  const statusOptions: Array<{ value: string; label: string }> = [
    { value: "all", label: "सभी" },
    { value: "pending", label: "लंबित" },
    { value: "under_review", label: "समीक्षा" },
    { value: "returned", label: "सुधार हेतु" },
    { value: "approved", label: "स्वीकृत" },
    { value: "rejected", label: "अस्वीकृत" },
  ];

  const priorityOptions: Array<{ value: string; label: string }> = [
    { value: "all", label: "सभी प्राथमिकताएँ" },
    { value: "critical", label: "अत्यंत उच्च" },
    { value: "high", label: "उच्च" },
    { value: "medium", label: "मध्यम" },
    { value: "low", label: "निम्न" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">खोज</span>
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="आवेदन ID या नाम"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0 transition focus:border-slate-300 focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">स्थिति</span>
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">प्राथमिकता</span>
          <select
            value={priority}
            onChange={(event) => onPriorityChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">क्रम</span>
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
          >
            <option value="urgency">तत्कालता</option>
            <option value="date">सबमिशन तिथि</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onReset}
          className="self-end rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          रीसेट
        </button>
      </div>
    </div>
  );
}
