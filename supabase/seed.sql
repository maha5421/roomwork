-- Два пробных кабинета для RoomWork (без ручной подстановки UUID)
-- 1) Сначала выполни schema.sql (или alter_rating.sql, если таблицы уже были созданы без рейтинга).
-- 2) Зарегистрируйся один раз на сайте roomwork.ru (или локально).
-- 3) Выполни этот скрипт в Supabase → SQL Editor.
-- owner_id подставится автоматически из первого пользователя в auth.users.

INSERT INTO public.spaces (
  owner_id,
  title,
  city,
  metro,
  price_per_hour,
  description,
  tags,
  images,
  phone,
  average_rating,
  reviews_count
)
SELECT
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  'Светлый кабинет для консультаций',
  'Москва',
  'Таганская',
  800,
  'Тихий кабинет с естественным светом. Идеально для психологов и консультаций. Кушетка, стол, чай.',
  ARRAY['Тихо', 'Кушетка', 'Чай/вода'],
  ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
  '+7 999 111-22-33',
  4.9,
  18
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);

INSERT INTO public.spaces (
  owner_id,
  title,
  city,
  metro,
  price_per_hour,
  description,
  tags,
  images,
  phone,
  average_rating,
  reviews_count
)
SELECT
  (SELECT id FROM auth.users ORDER BY created_at DESC LIMIT 1),
  'Кабинет для логопеда и занятий',
  'Москва',
  'Павелецкая',
  650,
  'Уютное пространство для занятий с детьми и взрослыми. Стол, стулья, белый шум.',
  ARRAY['Стол/стулья', 'Уютно', 'Белый шум'],
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  '+7 999 222-33-44',
  4.7,
  9
WHERE EXISTS (SELECT 1 FROM auth.users LIMIT 1);
