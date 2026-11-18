alter table public.posts add column image_path text;
alter table public.posts drop constraint posts_body_not_blank;
alter table public.posts add constraint posts_content_required check (body ~ '[^[:space:]]' or image_path is not null);
alter table public.posts add constraint posts_image_path_valid check (
 image_path is null or image_path ~ ('^' || id::text || '[.](jpg|png|webp)$')
);
grant insert (id, image_path) on public.posts to anon, authenticated;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wall-images','wall-images',true,5242880,array['image/jpeg','image/png','image/webp']);
create policy wall_images_public_upload on storage.objects for insert to anon, authenticated
with check (bucket_id = 'wall-images' and name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.](jpg|png|webp)$');
-- Public bucket serves reads. No visitor overwrite/delete permission.

