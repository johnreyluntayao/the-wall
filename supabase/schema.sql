-- Public, anonymous wall: everyone can read and share, nobody can edit/delete.
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  body text not null constraint posts_body_length check (char_length(body) <= 280)
    constraint posts_body_not_blank check (body ~ '[^[:space:]]'),
  created_at timestamptz not null default now()
);
create index posts_feed_idx on public.posts (created_at desc, id desc);
alter table public.posts enable row level security;
revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
-- Only body is client-writable; identity and timestamps are database-generated.
grant insert (body) on public.posts to anon, authenticated;
create policy posts_public_read on public.posts for select to anon, authenticated using (true);
create policy posts_public_share on public.posts for insert to anon, authenticated
  with check (user_id is null);
alter publication supabase_realtime add table public.posts;

