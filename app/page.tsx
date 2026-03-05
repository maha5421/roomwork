"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Space } from "@/lib/types";
import { SpaceCard } from "@/components/SpaceCard";

export default function HomePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("spaces")
      .select("*")
      .order("is_promoted", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setSpaces([]);
        } else {
          setSpaces((data as Space[]) ?? []);
        }
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
              Популярные кабинеты
            </h1>
            <p className="mt-1 text-sm text-neutral-600">
              {spaces.length > 0
                ? "Кабинеты из базы — выбирай и связывайся с владельцем."
                : "Демонстрационные карточки — добавь кабинеты через форму или выполни seed в Supabase."}
            </p>
          </div>
          <Link
            href="/spaces"
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
          >
            Фильтры
          </Link>
        </div>

        {loading ? (
          <p className="mt-8 text-neutral-600">Загрузка...</p>
        ) : spaces.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-12 text-center">
            <p className="text-neutral-700">Пока нет кабинетов в каталоге.</p>
            <Link
              href="/add"
              className="mt-4 inline-block rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Добавить кабинет
            </Link>
            <p className="mt-4 text-sm text-neutral-500">
              Или выполни <code className="rounded bg-neutral-100 px-1">supabase/seed.sql</code> в SQL Editor для демо-карточек.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
