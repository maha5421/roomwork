-- RoomWork MVP: таблицы spaces и reviews + RLS
-- Выполнить в Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ========== TABLES ==========

CREATE TABLE IF NOT EXISTS public.spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  city text NOT NULL DEFAULT 'Москва',
  metro text NOT NULL,
  price_per_hour int NOT NULL CHECK (price_per_hour > 0),
  description text,
  tags text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_promoted boolean NOT NULL DEFAULT false,
  average_rating numeric(3,2) NOT NULL DEFAULT 0,
  reviews_count int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Индексы для частых запросов
CREATE INDEX IF NOT EXISTS idx_spaces_owner_id ON public.spaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_spaces_created_at ON public.spaces(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_spaces_price_per_hour ON public.spaces(price_per_hour);
CREATE INDEX IF NOT EXISTS idx_spaces_city ON public.spaces(city);
CREATE INDEX IF NOT EXISTS idx_reviews_space_id ON public.reviews(space_id);

-- ========== RLS ==========

ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- spaces: SELECT — всем
CREATE POLICY "spaces_select_all"
  ON public.spaces FOR SELECT
  USING (true);

-- spaces: INSERT — только авторизованным, owner_id = auth.uid()
CREATE POLICY "spaces_insert_own"
  ON public.spaces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

-- spaces: UPDATE — только владелец
CREATE POLICY "spaces_update_own"
  ON public.spaces FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- spaces: DELETE — только владелец
CREATE POLICY "spaces_delete_own"
  ON public.spaces FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- reviews: SELECT — всем
CREATE POLICY "reviews_select_all"
  ON public.reviews FOR SELECT
  USING (true);

-- reviews: INSERT — только авторизованным (позже можно ограничить "после контакта")
CREATE POLICY "reviews_insert_authenticated"
  ON public.reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- При необходимости: UPDATE/DELETE своих отзывов (раскомментировать)
-- CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
-- CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ========== Рейтинг: обновление average_rating и reviews_count у space при изменении отзывов ==========
CREATE OR REPLACE FUNCTION public.update_space_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.spaces
    SET
      reviews_count = (SELECT count(*) FROM public.reviews WHERE space_id = OLD.space_id),
      average_rating = coalesce((SELECT round(avg(rating)::numeric, 2) FROM public.reviews WHERE space_id = OLD.space_id), 0)
    WHERE id = OLD.space_id;
    RETURN OLD;
  ELSE
    UPDATE public.spaces
    SET
      reviews_count = (SELECT count(*) FROM public.reviews WHERE space_id = NEW.space_id),
      average_rating = coalesce((SELECT round(avg(rating)::numeric, 2) FROM public.reviews WHERE space_id = NEW.space_id), 0)
    WHERE id = NEW.space_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_space_rating ON public.reviews;
CREATE TRIGGER trigger_update_space_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_space_rating();
