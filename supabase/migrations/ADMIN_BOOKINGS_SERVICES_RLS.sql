BEGIN;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'::user_role
  );
$$;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_select_admin" ON public.bookings
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "bookings_select_own" ON public.bookings
FOR SELECT
USING (auth.uid() = user_id);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_select_admin" ON public.services
FOR SELECT
USING (public.is_admin(auth.uid()));

COMMIT;

