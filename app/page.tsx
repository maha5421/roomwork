import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-neutral-50/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Кабинеты для работы по часам в Москве
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-600">
            Найди тихий кабинет рядом с метро или размести свой — бесплатно.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/spaces"
              className="inline-flex rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Найти кабинет
            </Link>
            <Link
              href="/add"
              className="inline-flex rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Разместить кабинет
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Как это работает
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <div className="text-3xl font-semibold text-neutral-900">1</div>
            <h3 className="mt-2 font-medium text-neutral-900">Выбери кабинет</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Фильтруй по метро, цене и удобствам. Смотри фото и описание.
            </p>
          </div>
          <div>
            <div className="text-3xl font-semibold text-neutral-900">2</div>
            <h3 className="mt-2 font-medium text-neutral-900">Свяжись с владельцем</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Нажми «Показать телефон» и договорись о времени и оплате.
            </p>
          </div>
          <div>
            <div className="text-3xl font-semibold text-neutral-900">3</div>
            <h3 className="mt-2 font-medium text-neutral-900">Работай в тишине</h3>
            <p className="mt-1 text-sm text-neutral-600">
              Приходи в назначенное время и работай без отвлечений.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-neutral-50/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <p className="text-center text-neutral-600">
            Размещение кабинета бесплатно.{" "}
            <Link href="/add" className="font-medium text-neutral-900 underline hover:no-underline">
              Добавить кабинет
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
