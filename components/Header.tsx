"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase, getUser } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

// Размер логотипа в шапке — поменяй под свой файл (ширина × высота в пикселях)
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 55;

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchMetro, setSearchMetro] = useState("");
  const [searchPrice, setSearchPrice] = useState("");

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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchMetro.trim()) params.set("q", searchMetro.trim());
    if (searchPrice.trim()) params.set("max", searchPrice.trim());
    router.push(params.toString() ? `/spaces?${params}` : "/spaces");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-md bg-white px-2 py-1.5"
          >
            <Image
              src="/logo.png"
              alt="RoomWork"
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              className="h-auto w-auto object-contain"
              style={{ height: LOGO_HEIGHT, width: "auto" }}
            />
          </Link>

          <form onSubmit={handleSearch} className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
            <input
              type="text"
              placeholder="Метро или район (Москва)"
              value={searchMetro}
              onChange={(e) => setSearchMetro(e.target.value)}
              className="w-44 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 sm:w-52"
            />
            <input
              type="number"
              placeholder="Р/час"
              min={1}
              value={searchPrice}
              onChange={(e) => setSearchPrice(e.target.value)}
              className="w-20 rounded-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500 sm:w-24"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Найти
            </button>
          </form>

          <nav className="flex shrink-0 items-center gap-2">
            <Link
              href="/add"
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            >
              Разместить
            </Link>
            {loading ? (
              <span className="text-neutral-400">...</span>
            ) : user ? (
              <>
                <span className="max-w-[120px] truncate text-sm text-neutral-600 sm:max-w-[160px]" title={user.email ?? ""}>
                  {user.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
