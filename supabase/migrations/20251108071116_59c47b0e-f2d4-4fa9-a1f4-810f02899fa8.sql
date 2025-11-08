-- Add additional address fields to the addresses table
ALTER TABLE public.addresses 
ADD COLUMN IF NOT EXISTS house_number text,
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS area text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS pincode text,
ADD COLUMN IF NOT EXISTS label text,
ADD COLUMN IF NOT EXISTS is_default boolean DEFAULT false;

-- Update existing address_line column to be nullable since we'll have structured fields
ALTER TABLE public.addresses 
ALTER COLUMN address_line DROP NOT NULL;

-- Add a function to ensure only one default address per user
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = true THEN
    UPDATE public.addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for default address
DROP TRIGGER IF EXISTS ensure_single_default_address_trigger ON public.addresses;
CREATE TRIGGER ensure_single_default_address_trigger
BEFORE INSERT OR UPDATE ON public.addresses
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_address();