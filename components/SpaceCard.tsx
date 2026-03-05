import Link from "next/link";
import type { Space } from "@/lib/types";

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const rating =
    (space.reviews_count ?? 0) > 0
      ? `★ ${Number(space.average_rating ?? 0).toFixed(1)} (${space.reviews_count})`
      : "Пока нет отзывов";

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
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
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              Нет фото
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="font-semibold text-neutral-900">{space.title}</p>
          <p className="mt-1 text-lg font-semibold text-neutral-900">
            {space.price_per_hour} р/час
          </p>
          <p className="mt-0.5 text-sm text-neutral-700">{rating}</p>
          <p className="mt-0.5 text-sm text-neutral-600">м. {space.metro}</p>
          {space.tags?.length ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {space.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-neutral-300 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-700"
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
          className="flex-1 rounded-full border border-neutral-300 py-2.5 text-center text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Подробнее
        </Link>
        <Link
          href="/login"
          className="rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Написать
        </Link>
      </div>
    </article>
  );
}
