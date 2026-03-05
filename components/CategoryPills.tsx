import Link from "next/link";
import type { Space } from "@/lib/types";

const CATEGORIES = [
  { label: "Психологи", tag: "психолог" },
  { label: "Логопеды", tag: "логопед" },
  { label: "Косметологи", tag: "косметолог" },
  { label: "Массаж", tag: "массаж" },
  { label: "Тихо", tag: "Тихо" },
  { label: "Шумоизоляция", tag: "Шумоизоляция" },
  { label: "Кушетка", tag: "Кушетка" },
  { label: "Раковина", tag: "Раковина" },
  { label: "Центр", tag: "Центр" },
];

export function CategoryPills() {
  return (
    <div className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(({ label, tag }) => (
            <Link
              key={tag}
              href={`/spaces?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
