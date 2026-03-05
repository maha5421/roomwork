"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMsg(error.message);
        setLoading(false);
        return;
      }
      setMsg("Готово! Если включено подтверждение email — проверь почту.");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setMsg(
        message.includes("fetch") || message.includes("Load failed")
          ? "Не удалось подключиться к серверу. Проверь интернет. Если сайт на Vercel — добавь NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в настройках проекта."
          : message
      );
    }
    setLoading(false);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50/50">
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Регистрация
        </h1>
        <p className="mt-1 text-sm text-neutral-800">
          Создай аккаунт, чтобы размещать кабинеты и связываться с владельцами.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-neutral-800">
              Email
            </label>
            <input
              id="signup-email"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-neutral-800">
              Пароль
            </label>
            <input
              id="signup-password"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Создаём..." : "Зарегистрироваться"}
          </button>

          {msg && (
            <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
              {msg}
            </div>
          )}

          <p className="text-center text-sm text-neutral-800">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="font-semibold text-neutral-900 hover:underline">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
