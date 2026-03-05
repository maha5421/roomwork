"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, getUser } from "@/lib/supabaseClient";
import { addSpaceSchema, type AddSpaceInput } from "@/lib/validations";

export default function AddSpacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<Record<string, string>>({});

  useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        router.replace("/login");
        return;
      }
      setLoading(false);
    });
  }, [router]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError({});
    setError(null);

    const form = e.currentTarget;
    const raw: AddSpaceInput = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value.trim(),
      metro: (form.elements.namedItem("metro") as HTMLInputElement).value.trim(),
      price_per_hour: Number((form.elements.namedItem("price_per_hour") as HTMLInputElement).value),
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value.trim() || undefined,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim() || undefined,
      tags: (form.elements.namedItem("tags") as HTMLInputElement).value.trim() || undefined,
      image1: (form.elements.namedItem("image1") as HTMLInputElement).value.trim() || undefined,
      image2: (form.elements.namedItem("image2") as HTMLInputElement).value.trim() || undefined,
      image3: (form.elements.namedItem("image3") as HTMLInputElement).value.trim() || undefined,
    };

    const parsed = addSpaceSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (path && !fieldErrors[path]) fieldErrors[path] = err.message;
      });
      setFormError(fieldErrors);
      return;
    }

    const tags = parsed.data.tags
      ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const images = [parsed.data.image1, parsed.data.image2, parsed.data.image3].filter(
      (u): u is string => Boolean(u && u.length > 0)
    );

    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }

    const { data: space, error: insertError } = await supabase
      .from("spaces")
      .insert({
        owner_id: user.id,
        title: parsed.data.title,
        city: "Москва",
        metro: parsed.data.metro,
        price_per_hour: parsed.data.price_per_hour,
        description: parsed.data.description || null,
        phone: parsed.data.phone || null,
        tags,
        images,
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    if (space?.id) {
      router.push(`/spaces/${space.id}`);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-neutral-50/50 flex items-center justify-center">
        <p className="text-neutral-500">Загрузка...</p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-neutral-50/50">
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Добавить кабинет
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Заполни данные. Размещение бесплатно.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-800">
              Название *
            </label>
            <input
              id="title"
              name="title"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="Например: Кабинет на Арбатской"
              required
            />
            {formError.title && <p className="mt-1 text-sm text-red-600">{formError.title}</p>}
          </div>

          <div>
            <label htmlFor="metro" className="block text-sm font-medium text-neutral-800">
              Станция метро *
            </label>
            <input
              id="metro"
              name="metro"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="Например: Арбатская"
              required
            />
            {formError.metro && <p className="mt-1 text-sm text-red-600">{formError.metro}</p>}
          </div>

          <div>
            <label htmlFor="price_per_hour" className="block text-sm font-medium text-neutral-800">
              Цена за час (₽) *
            </label>
            <input
              id="price_per_hour"
              name="price_per_hour"
              type="number"
              min={1}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="500"
              required
            />
            {formError.price_per_hour && <p className="mt-1 text-sm text-red-600">{formError.price_per_hour}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-800">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="Тихий кабинет с окном, стол, стул, розетки..."
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-800">
              Телефон для связи
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="+7 999 123-45-67"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-neutral-800">
              Теги (через запятую)
            </label>
            <input
              id="tags"
              name="tags"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="тишина, wi-fi, кондиционер"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Фото (URL, до 3 шт.)
            </label>
            <input
              id="image1"
              name="image1"
              type="url"
              className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="https://..."
            />
            <input
              id="image2"
              name="image2"
              type="url"
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="https://..."
            />
            <input
              id="image3"
              name="image3"
              type="url"
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
              placeholder="https://..."
            />
            {(formError.image1 || formError.image2 || formError.image3) && (
              <p className="mt-1 text-sm text-red-600">Укажите корректные URL изображений</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {submitting ? "Публикуем..." : "Опубликовать"}
            </button>
            <Link
              href="/spaces"
              className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
