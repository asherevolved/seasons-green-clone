-- Fix infinite recursion in RLS policies by creating a security definer function
-- This function checks if a user has admin role without triggering RLS recursion

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

-- Drop existing admin policies that cause recursion
DROP POLICY IF EXISTS "addresses_select_admin" ON public.addresses;
DROP POLICY IF EXISTS "addresses_update_admin" ON public.addresses;
DROP POLICY IF EXISTS "addresses_delete_admin" ON public.addresses;

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

-- Recreate admin policies using the security definer function
CREATE POLICY "addresses_select_admin" ON public.addresses
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "addresses_update_admin" ON public.addresses
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "addresses_delete_admin" ON public.addresses
FOR DELETE
USING (public.is_admin(auth.uid()));

CREATE POLICY "profiles_select_admin" ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "profiles_update_admin" ON public.profiles
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));