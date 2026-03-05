"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50/50">
      <div className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Вход
        </h1>
        <p className="mt-1 text-sm text-neutral-800">
          Войди, чтобы размещать кабинеты и связываться с владельцами.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium text-neutral-800">
              Email
            </label>
            <input
              id="login-email"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium text-neutral-800">
              Пароль
            </label>
            <input
              id="login-password"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ваш пароль"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Входим..." : "Войти"}
          </button>

          {msg && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {msg}
            </div>
          )}

          <p className="text-center text-sm text-neutral-800">
            Нет аккаунта?{" "}
            <Link href="/signup" className="font-semibold text-neutral-900 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
