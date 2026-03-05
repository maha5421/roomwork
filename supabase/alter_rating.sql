-- Если таблица spaces уже создана без рейтинга — выполни это в SQL Editor.
-- Добавляет колонки рейтинга и триггер для их обновления.

ALTER TABLE public.spaces ADD COLUMN IF NOT EXISTS average_rating numeric(3,2) NOT NULL DEFAULT 0;
ALTER TABLE public.spaces ADD COLUMN IF NOT EXISTS reviews_count int NOT NULL DEFAULT 0;

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

-- Обновить рейтинг для существующих отзывов
UPDATE public.spaces s SET
  reviews_count = (SELECT count(*) FROM public.reviews r WHERE r.space_id = s.id),
  average_rating = coalesce((SELECT round(avg(rating)::numeric, 2) FROM public.reviews r WHERE r.space_id = s.id), 0);
