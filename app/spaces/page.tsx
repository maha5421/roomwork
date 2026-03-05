"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import type { Space } from "@/lib/types";

type SortType = "recommended" | "price_asc" | "rating_desc";

function SpacesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const max = searchParams.get("max") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const sort = (searchParams.get("sort") as SortType) || "recommended";

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let query = supabase
      .from("spaces")
      .select("*");

    if (q.trim()) {
      query = query.or(`metro.ilike.%${q.trim()}%,title.ilike.%${q.trim()}%`);
    }
    if (max) {
      const maxNum = Number(max);
      if (!Number.isNaN(maxNum) && maxNum > 0) {
        query = query.lte("price_per_hour", maxNum);
      }
    }
    if (tag.trim()) {
      query = query.contains("tags", [tag.trim()]);
    }

    switch (sort) {
      case "price_asc":
        query = query.order("price_per_hour", { ascending: true });
        break;
      case "rating_desc":
        query = query.order("average_rating", { ascending: false }).order("created_at", { ascending: false });
        break;
      default:
        query = query.order("is_promoted", { ascending: false }).order("created_at", { ascending: false });
    }

    query.then(({ data, error }) => {
      if (error) {
        console.error(error);
        setSpaces([]);
      } else {
        setSpaces((data as Space[]) ?? []);
      }
      setLoading(false);
    });
  }, [q, max, tag, sort]);

  function buildSearchParams(updates: Record<string, string>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    return next.toString();
  }

  function updateFilters(updates: Record<string, string>) {
    const params = buildSearchParams(updates);
    router.replace(params ? `/spaces?${params}` : "/spaces");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Кабинеты в Москве
        </h1>

        {/* Фильтры */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <input
            type="text"
            placeholder="Метро или название"
            defaultValue={q}
            key={`q-${q}`}
            onChange={(e) => updateFilters({ q: e.target.value.trim() })}
            className="w-48 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
          />
          <input
            type="number"
            placeholder="Макс. цена/час"
            min={1}
            defaultValue={max || undefined}
            key={`max-${max}`}
            onChange={(e) => updateFilters({ max: e.target.value.trim() })}
            className="w-28 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
          />
          <input
            type="text"
            placeholder="Тег"
            defaultValue={tag}
            key={`tag-${tag}`}
            onChange={(e) => updateFilters({ tag: e.target.value.trim() })}
            className="w-32 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none placeholder:text-neutral-600 focus:border-neutral-500"
          />
          <select
            value={sort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-500"
          >
            <option value="recommended">Рекомендуемые</option>
            <option value="price_asc">Сначала дешевле</option>
            <option value="rating_desc">По рейтингу</option>
          </select>
        </div>

        {loading ? (
          <p className="mt-8 text-neutral-700">Загрузка...</p>
        ) : spaces.length === 0 ? (
          <p className="mt-8 text-neutral-800">
            Ничего не найдено. Попробуй другие фильтры или{" "}
            <Link href="/add" className="font-semibold text-neutral-900 underline">
              добавь кабинет
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <article
                key={space.id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <Link href={`/spaces/${space.id}`} className="block">
                  <div className="relative aspect-[4/3] bg-neutral-200">
                    {space.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={space.images[0]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-600">
                        Нет фото
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-neutral-900">{space.title}</p>
                    <p className="mt-1 text-sm text-neutral-800">
                      м. {space.metro}
                      {(space.reviews_count ?? 0) > 0 ? (
                        <span className="ml-2 text-neutral-700">
                          ★ {Number(space.average_rating ?? 0).toFixed(1)} ({space.reviews_count})
                        </span>
                      ) : (
                        <span className="ml-2 text-neutral-500">· Пока нет отзывов</span>
                      )}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-neutral-900">
                      {space.price_per_hour} ₽/час
                    </p>
                    {space.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {space.tags.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs text-neutral-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </Link>
                <div className="flex gap-2 border-t border-neutral-100 p-4">
                  <Link
                    href={`/spaces/${space.id}`}
                    className="flex-1 rounded-xl border border-neutral-400 py-2 text-center text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                  >
                    Подробнее
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                  >
                    Написать
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SpacesPage() {
  return (
    <Suspense fallback={<p className="flex min-h-[50vh] items-center justify-center text-neutral-700">Загрузка...</p>}>
      <SpacesContent />
    </Suspense>
  );
}
