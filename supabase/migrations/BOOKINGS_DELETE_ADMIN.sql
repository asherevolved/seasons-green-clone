BEGIN;

-- Allow admins to delete any bookings
CREATE POLICY "bookings_delete_admin" ON public.bookings
FOR DELETE
USING (public.is_admin(auth.uid()));

COMMIT;

