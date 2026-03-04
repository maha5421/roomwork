// src/app/page.tsx
import Image from "next/image";

type Space = {
  id: string;
  title: string;
  metro: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  imageUrl: string;
};

const demoSpaces: Space[] = [
  {
    id: "1",
    title: "Светлый кабинет для консультаций",
    metro: "Таганская",
    pricePerHour: 800,
    rating: 4.9,
    reviewsCount: 18,
    tags: ["Тихо", "Кушетка", "Чай/вода"],
    imageUrl:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "2",
    title: "Кабинет для логопеда и занятий",
    metro: "Павелецкая",
    pricePerHour: 650,
    rating: 4.7,
    reviewsCount: 9,
    tags: ["Стол/стулья", "Уютно", "Белый шум"],
    imageUrl:
      "https://images.unsplash.com/photo-1527030280862-64139fba04ca?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "3",
    title: "Кабинет для бьюти-мастера",
    metro: "Курская",
    pricePerHour: 1200,
    rating: 4.8,
    reviewsCount: 24,
    tags: ["Раковина", "Лампа", "Хранение"],
    imageUrl:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=80",
  },
  {
    id: "4",
    title: "Нейтральный кабинет под частную практику",
    metro: "Белорусская",
    pricePerHour: 900,
    rating: 4.6,
    reviewsCount: 12,
    tags: ["Шумоизоляция", "Окно", "Зона ожидания"],
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=80",
  },
];

const tagChips = [
  "Психологи",
  "Логопеды",
  "Косметологи",
  "Массаж",
  "Тихо",
  "Шумоизоляция",
  "Кушетка",
  "Раковина",
  "Центр",
];

function formatRub(n: number) {
  return new Intl.NumberFormat("ru-RU").format(n);
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-neutral-900" />
            <span className="text-lg font-semibold tracking-tight">RoomWork</span>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2 shadow-sm">
            <input
              className="w-56 bg-transparent text-sm outline-none placeholder:text-neutral-500"
              placeholder="Метро или район (Москва)"
            />
            <div className="h-5 w-px bg-neutral-200" />
            <input
              className="w-24 bg-transparent text-sm outline-none placeholder:text-neutral-500"
              placeholder="₽/час"
              inputMode="numeric"
            />
            <button className="ml-1 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
              Найти
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
              Разместить
            </button>
            <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
              Войти
            </button>
          </div>
        </div>

        {/* Chips */}
        <div className="mx-auto max-w-6xl px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tagChips.map((t) => (
              <button
                key={t}
                className="whitespace-nowrap rounded-full border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80"
              alt="RoomWork"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent" />
          </div>

          <div className="relative p-8 md:p-12">
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Почасовая аренда кабинетов для специалистов в Москве
            </h1>
            <p className="mt-3 max-w-xl text-base text-white/90 md:text-lg">
              Находите кабинеты под консультации, занятия и частную практику. Без посредников.
            </p>

            <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg md:flex-row md:items-center">
              <input
                className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none"
                placeholder="Метро или район"
              />
              <input
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none md:w-40"
                placeholder="Цена до, ₽/час"
                inputMode="numeric"
              />
              <button className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white">
                Найти кабинет
              </button>
            </div>

            <div className="mt-4 text-sm text-white/80">
              Размещение для арендодателей — бесплатно. Поднятие в поиске — платно.
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Популярные кабинеты</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Демонстрационные карточки — дальше подключим базу и реальные объявления.
            </p>
          </div>
          <button className="hidden md:inline-flex rounded-full border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-50">
            Фильтры
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoSpaces.map((s) => (
            <a
              key={s.id}
              href="#"
              className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={s.imageUrl}
                  alt={s.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-medium">
                  {formatRub(s.pricePerHour)} ₽/час
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold leading-snug">{s.title}</div>
                    <div className="mt-1 text-sm text-neutral-600">м. {s.metro}</div>
                  </div>
                  <div className="shrink-0 text-sm font-medium">
                    ★ {s.rating.toFixed(1)}{" "}
                    <span className="text-neutral-500">({s.reviewsCount})</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
                    Подробнее
                  </button>
                  <button className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                    Написать
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
          © {new Date().getFullYear()} RoomWork • Москва • Почасовая аренда кабинетов
        </div>
      </footer>
    </div>
  );
}