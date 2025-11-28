BEGIN;

-- Allow admins to update any bookings
CREATE POLICY "bookings_update_admin" ON public.bookings
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

COMMIT;

