DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'asher.infernoservices@gmail.com';

  IF uid IS NOT NULL THEN
    INSERT INTO public.profiles (id, role, email)
    VALUES (uid, 'admin', 'asher.infernoservices@gmail.com')
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      email = EXCLUDED.email,
      updated_at = now();
  END IF;
END $$;

