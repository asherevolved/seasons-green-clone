DO $$
BEGIN
  -- Lawn Mowing
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE title = 'Lawn Mowing') THEN
    INSERT INTO public.services (title, description, category, price, duration_minutes, active)
    VALUES ('Lawn Mowing', 'Perfectly manicured lawns', 'lawn-care', 499, 60, true);
  END IF;

  -- Garden Weeding
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE title = 'Garden Weeding') THEN
    INSERT INTO public.services (title, description, category, price, duration_minutes, active)
    VALUES ('Garden Weeding', 'Keep your garden pristine', 'garden-maintenance', 399, 60, true);
  END IF;

  -- Hedge Trimming
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE title = 'Hedge Trimming') THEN
    INSERT INTO public.services (title, description, category, price, duration_minutes, active)
    VALUES ('Hedge Trimming', 'Shaping and maintenance', 'tree-trimming', 599, 60, true);
  END IF;

  -- Precision Lawn Mowing
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE title = 'Precision Lawn Mowing') THEN
    INSERT INTO public.services (title, description, category, price, duration_minutes, active)
    VALUES ('Precision Lawn Mowing', 'Includes mowing, edging, and blowing clippings for a pristine finish.', 'lawn-care', 699, 60, true);
  END IF;

  -- Hedge Trimming & Shaping
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE title = 'Hedge Trimming & Shaping') THEN
    INSERT INTO public.services (title, description, category, price, duration_minutes, active)
    VALUES ('Hedge Trimming & Shaping', 'Expert trimming and shaping for healthy, beautiful hedges.', 'tree-trimming', 899, 60, true);
  END IF;

  -- Seasonal Flower Planting
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE title = 'Seasonal Flower Planting') THEN
    INSERT INTO public.services (title, description, category, price, duration_minutes, active)
    VALUES ('Seasonal Flower Planting', 'Beautify your garden with vibrant, seasonal flowers.', 'garden-maintenance', 799, 60, true);
  END IF;

  -- Garden Maintenance
  IF NOT EXISTS (SELECT 1 FROM public.services WHERE title = 'Garden Maintenance') THEN
    INSERT INTO public.services (title, description, category, price, duration_minutes, active)
    VALUES ('Garden Maintenance', 'Complete garden care and upkeep', 'garden-maintenance', 1299, 60, true);
  END IF;
END $$;

