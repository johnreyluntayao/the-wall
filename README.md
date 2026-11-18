# My Wall

A project for the 2008-style Facebook Wall challenge.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run lint
npm run build
```

## Supabase backend

Connected project: **The Wall** (`ejchvonfkqfgnlhmxthb`, Singapore).
The posts schema is already applied to this project. `supabase/schema.sql`
records the setup SQL for a fresh project; do not rerun it on this database.
The hosted migration is named `create_public_wall_posts`.

Local credentials are configured in the ignored `.env.local`. For another
checkout, copy `.env.example` to `.env.local` and fill in the project URL and
publishable key. Add the same variables in Vercel before building:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a fallback.
No service-role key or database password is needed.

### Frontend integration

Import from `@/lib/posts`:

- `listPosts(page?, pageSize?)`: newest-first pages, default 50 posts.
- `createPost(message)`: validates and saves a message, returning its row.
- `subscribeToPosts(onPost, onStatus?)`: receives new posts and returns a
  cleanup function for a client component effect.
- `countCharacters(message)` and `MAX_POST_LENGTH`: Unicode-aware counter.

Subscribe before loading the feed. Refetch when the status is `SUBSCRIBED`
(also emitted after reconnection), merge fetched/created/realtime rows by ID,
and sort by descending `created_at`, then ID. Display loading and error states;
do not overwrite new events with an older fetch result.

The table has UUID IDs, nullable `user_id`, message `body`, and server timestamps.
Database checks reject null, blank, and over-280-character messages.
RLS allows public reads and anonymous posting as required by the challenge.
Only `body` is writable: visitors cannot set identity/timestamps or edit/delete
posts. There is no login, rate limiter, or moderation system in this scope.
Realtime INSERT delivery is enabled through `supabase_realtime`.

### Backend verification

`node scripts/check-backend.mjs` checks public API reads.
`node scripts/check-backend.mjs --write` also checks posting, Realtime delivery,
and invalid message rejection. This opt-in mode leaves one labeled test post
and prints its ID; delete that row through the Supabase dashboard afterward.

## Frontend components

The responsive wall uses shadcn/ui Button, Textarea, and Skeleton components,
Lucide icons, and a shared theme in `app/globals.css`. Layout and component
styles are in `app/wall.css`, imported by the global stylesheet.

- `components/wall/`: header, profile, intro, composer, post card, feed, and about panel.
- `components/ui/`: reusable UI primitives.
- `lib/imports.ts`: shared UI and icon exports. Feature components use a
  separate barrel to avoid circular imports.
- `hooks/use-wall.ts`: Supabase loading, sharing, pagination, Realtime, and deduplication.

Share saves to Supabase; posts reload on refresh and arrive through Realtime.
Older posts are available through the Older posts button. All posts use the
fixed name Wall Visitor. Photo uploads are not included.

Run `npm run dev` to preview locally. This work has not deployed to Vercel.
