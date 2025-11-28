BEGIN;

-- Allow authenticated users to insert their own bookings
CREATE POLICY "bookings_insert_own" ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own bookings (optional, safe)
CREATE POLICY "bookings_update_own" ON public.bookings
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow public (anon) select of services, since these are catalog items
CREATE POLICY "services_select_public" ON public.services
FOR SELECT
USING (true);

COMMIT;

