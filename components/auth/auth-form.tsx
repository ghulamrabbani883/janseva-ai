"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { useDemoAuth } from "@/components/auth/demo-auth-provider";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { login, register } = useDemoAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (isRegister && name.trim().length < 2) {
      setError("कृपया अपना पूरा नाम दर्ज करें।");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("कृपया मान्य ईमेल पता दर्ज करें।");
      return;
    }
    if (password.length < 8) {
      setError("पासवर्ड कम से कम 8 अक्षर का होना चाहिए।");
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      const requestedRoute = new URLSearchParams(window.location.search).get("next");
      const safeRoute = requestedRoute?.startsWith("/") && !requestedRoute.startsWith("//")
        ? requestedRoute
        : "/";
      router.replace(safeRoute);
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "कार्य पूरा नहीं हो सका।");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[1fr_1.1fr]">
        <section className="flex flex-col justify-between bg-slate-900 p-8 text-white md:p-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/15 text-xl font-bold text-emerald-300">J</div>
              <div>
                <div className="font-semibold">JanSeva AI</div>
                <div className="text-xs text-slate-400">सरकारी आवेदन समीक्षा</div>
              </div>
            </div>
            <div className="mt-14 max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                केवल डेमो — वास्तविक सरकारी सेवा नहीं
              </div>
              <h1 className="mt-5 text-3xl font-semibold leading-tight">
                {isRegister ? "डेमो अधिकारी खाता बनाएँ" : "अधिकारी पोर्टल में प्रवेश करें"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                आवेदन समीक्षा और निर्णय सहायता का एक काल्पनिक, हिंदी-प्रथम प्रोटोटाइप।
                यहां बनाए गए खाते और सत्र केवल इसी ब्राउज़र में सहेजे जाते हैं।
              </p>
            </div>
          </div>
          <p className="mt-12 text-xs leading-5 text-slate-400">
            इस प्रदर्शन में कोई वास्तविक नागरिक डेटा उपयोग न करें। डेमो लॉगिन
            production authentication या सुरक्षा का विकल्प नहीं है।
          </p>
        </section>

        <section className="p-6 md:p-10">
          <div className="mb-7">
            <div className="text-sm font-medium text-emerald-700">अधिकारी कार्यक्षेत्र</div>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {isRegister ? "पंजीकरण" : "स्वागत है"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isRegister ? "इस ब्राउज़र में स्थानीय डेमो खाता बनाएँ।" : "अपने डेमो खाते से आगे बढ़ें।"}
            </p>
          </div>

          {!isRegister && (
            <div className="mb-5 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
              <div className="font-semibold">पहली बार? डेमो खाता</div>
              <div className="mt-1">ईमेल: <code>officer@janseva.demo</code></div>
              <div>पासवर्ड: <code>Demo@123</code></div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <label className="block text-sm font-medium text-slate-700">
                अधिकारी का नाम
                <span className="relative mt-1.5 block">
                  <UserRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    autoComplete="name"
                    required
                    minLength={2}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    placeholder="पूरा नाम"
                  />
                </span>
              </label>
            )}

            <label className="block text-sm font-medium text-slate-700">
              ईमेल
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="officer@example.demo"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              पासवर्ड
              <span className="relative mt-1.5 block">
                <KeyRound className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="कम से कम 8 अक्षर"
                />
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "कृपया प्रतीक्षा करें…" : isRegister ? "डेमो खाता बनाएँ" : "प्रवेश करें"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isRegister ? "पहले से खाता है?" : "नया डेमो खाता चाहिए?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-semibold text-emerald-700 hover:text-emerald-800"
            >
              {isRegister ? "लॉगिन करें" : "पंजीकरण करें"}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
