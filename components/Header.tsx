"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, getUser } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then(setUser).finally(() => setLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-neutral-900">
          RoomWork
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/spaces"
            className="rounded-full px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
          >
            Каталог
          </Link>
          {loading ? (
            <span className="text-sm text-neutral-600">...</span>
          ) : user ? (
            <>
              <Link
                href="/add"
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
              >
                Разместить
              </Link>
              <span className="max-w-[160px] truncate text-sm text-neutral-800" title={user.email ?? ""}>
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-neutral-400 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
              >
                Войти
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
              >
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
