BEGIN;

CREATE OR REPLACE VIEW public.admin_bookings_view AS
SELECT
  b.id,
  b.user_id,
  b.service_id,
  b.start_time,
  b.end_time,
  b.status,
  b.total_price,
  b.notes,
  b.created_at,
  p.full_name,
  p.email,
  p.phone,
  COALESCE(p.address_line, addr.address_line) AS address_line,
  s.title AS service_title,
  s.category AS service_category,
  s.price AS service_price,
  s.duration_minutes AS service_duration
FROM public.bookings b
LEFT JOIN public.profiles p ON p.id = b.user_id
LEFT JOIN public.services s ON s.id = b.service_id
LEFT JOIN LATERAL (
  SELECT a.*
  FROM public.addresses a
  WHERE a.user_id = b.user_id
  ORDER BY a.is_default DESC, a.created_at DESC NULLS LAST
  LIMIT 1
) addr ON true;

COMMIT;

