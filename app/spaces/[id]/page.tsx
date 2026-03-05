"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase, getUser } from "@/lib/supabaseClient";
import type { Space } from "@/lib/types";

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 11) {
    return `+7 *** ** ** ${digits.slice(-2)}`;
  }
  return "+7 *** ** ** **";
}

export default function SpaceDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (!id) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    supabase
      .from("spaces")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setSpace(null);
        } else {
          setSpace(data as Space);
        }
        setLoading(false);
      });
    getUser().then((u) => setIsAuth(!!u));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-neutral-50/50">
        <p className="text-neutral-700">Загрузка...</p>
      </main>
    );
  }

  if (!space) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-neutral-50/50">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center">
          <h1 className="text-xl font-semibold text-neutral-900">Кабинет не найден</h1>
          <Link href="/spaces" className="mt-4 inline-block text-neutral-800 underline hover:no-underline">
            Вернуться в каталог
          </Link>
        </div>
      </main>
    );
  }

  const images = space.images?.filter(Boolean) ?? [];

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50/50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link href="/spaces" className="text-sm text-neutral-800 hover:text-neutral-900">
          ← Каталог
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-neutral-900">
          {space.title}
        </h1>
        <p className="mt-1 text-neutral-800">{space.metro}</p>
        <p className="mt-2 text-2xl font-semibold text-neutral-900">
          {space.price_per_hour} ₽/час
        </p>

        {/* Галерея */}
        <div className="mt-6 grid gap-2 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          {images.length > 0 ? (
            images.length === 1 ? (
              <div className="relative aspect-[16/10] bg-neutral-200">
                <Image
                  src={images[0]}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className={`grid gap-2 ${images.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                {images.slice(0, 3).map((src, i) => (
                  <div key={i} className="relative aspect-[4/3] bg-neutral-200">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center text-neutral-600">
              Нет фото
            </div>
          )}
        </div>

        {space.tags?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {space.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        {space.description ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="font-medium text-neutral-900">Описание</h2>
            <p className="mt-2 whitespace-pre-wrap text-neutral-800">{space.description}</p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {space.phone ? (
            <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-4">
              <p className="text-sm font-medium text-neutral-800">Телефон</p>
              {showPhone ? (
                <a href={`tel:${space.phone}`} className="mt-1 block text-lg font-semibold text-neutral-900">
                  {space.phone}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPhone(true)}
                  className="mt-1 block text-lg font-semibold text-neutral-900 hover:underline"
                >
                  {maskPhone(space.phone)}
                </button>
              )}
              {!showPhone && (
                <button
                  type="button"
                  onClick={() => setShowPhone(true)}
                  className="mt-2 text-sm font-medium text-neutral-800 underline hover:no-underline"
                >
                  Показать телефон
                </button>
              )}
            </div>
          ) : null}
          {isAuth ? (
            <span className="inline-flex rounded-xl border border-neutral-400 px-6 py-3 text-sm font-medium text-neutral-700">
              Скоро будет чат
            </span>
          ) : (
            <Link
              href="/login"
              className="inline-flex rounded-xl bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Написать
            </Link>
          )}
        </div>
        {!isAuth && <p className="mt-2 text-sm text-neutral-700">Войди, чтобы написать владельцу. Чат в разработке.</p>}
      </div>
    </main>
  );
}
