## Goals
- Add profile customization in the Profiles page: editable name and profile picture.
- Persist changes in `public.profiles` (`full_name`, `avatar_url`).
- Provide a clean UX for uploading a new avatar image.

## UI Changes
- Edit Profile Dialog (`src/components/EditProfileDialog.tsx`):
  - Add an avatar preview at the top using current `profile?.avatar_url` or a placeholder.
  - Add a file input to select an image, and an "Upload" action.
  - Keep existing fields for Full Name, Phone, Email.
  - After successful upload, set `avatar_url` and include it in the save.
- Profile Header (`src/pages/Profile.tsx`):
  - Continue to render `AvatarImage` from `profile?.avatar_url` and use the updated value after save.
  - Display name: `profile?.full_name ?? user?.user_metadata?.full_name ?? 'User'`.

## Storage Integration
- Use Supabase Storage with a public bucket named `avatars`.
- On first use, create the bucket if it doesn’t exist (runtime check via `supabase.storage.createBucket('avatars', { public: true })`).
- Upload flow:
  - Read the selected file in the dialog.
  - Generate a path like `userId/timestamp.ext` and upload to `avatars`.
  - Retrieve a public URL (`supabase.storage.from('avatars').getPublicUrl(path)`) and store it into `profiles.avatar_url`.

## App Logic Changes
- Edit Profile Dialog save flow:
  - If a new image was selected, upload it before persisting.
  - Switch `.update({...}).eq('id', user.id)` to an `upsert` so it creates the row if missing:
    - Payload includes `id`, `full_name`, `email`, `phone`, `avatar_url`.
- Optional: Debounce validations and ensure basic image type/size constraints (e.g., ≤ 5 MB, jpeg/png/webp).

## Database/RLS
- No new columns required; `avatar_url` already exists in `public.profiles`.
- If owner policies aren’t present, apply owner-only policies for `profiles` (read/update own row). We’ll reuse the guarded SQL from the previous plan if needed.

## Verification
- Start local Supabase.
- Log in, open Profiles → Edit Profile.
- Upload an image and set a new name, save.
- Confirm preview updates, and the `public.profiles` row contains the new `full_name` and `avatar_url`.

## Notes
- Bucket creation is performed once at runtime and is safe in dev.
- All changes are confined to Profiles and the edit dialog, matching your request for customization.