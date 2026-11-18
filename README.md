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

- `listPosts(page?, pageSize?)`: posts and total count, newest first, 10 per page by default. The first page is index 0.
- `createPost(message)`: validates and saves a message, returning its row.
- `subscribeToPosts(onPost, onStatus?)`: receives new posts and returns a
  cleanup function for a client component effect.
- `countCharacters(message)` and `MAX_POST_LENGTH`: Unicode-aware counter.

Reload the selected page when Realtime connects or a post arrives. Each query
sorts by descending `created_at`, then ID, and returns the current page count.

The table has UUID IDs, nullable `user_id`, message `body`, and server timestamps.
Database checks reject null, blank, and over-280-character messages.
RLS allows public reads and anonymous posting as required by the challenge.
Visitors can supply a draft UUID, body, and matching image path. User identity
and timestamps remain protected; visitors cannot edit/delete posts.
There is no login, rate limiter, or moderation system in this scope.
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
- `hooks/use-wall.ts`: Supabase loading, sharing, pagination, and Realtime.

Share saves to Supabase; posts reload on refresh and arrive through Realtime.
Older posts are available through the numbered pager. All posts use the
fixed name Johnrey V. Luntayao and the supplied profile photo. Johnrey’s profile details are centralized in
`lib/profile.ts`; the advertisement uses a captured portfolio screenshot.

### Photo uploads

The hosted `add_wall_photo_uploads` migration is recorded in
`supabase/photo-uploads.sql`. Apply it after `schema.sql` for a fresh project.
Photos are saved in the public `wall-images` Storage bucket, with their path
stored in `posts.image_path`. JPEG, PNG, and WebP files up to 5 MB are accepted.
Photo-only posts are supported. Selection checks also reject corrupt images
and images over 40 megapixels. The bucket enforces MIME and size restrictions.

Draft UUIDs make retries idempotent. Failed submissions preserve text and the
selected photo; repeated attempts reuse an uploaded file. Storage and database
writes are separate, so abandoning a draft after upload but before a successful
insert can leave an unreferenced object. Admins can clean those through Storage;
anonymous deletion and overwrites are intentionally disabled.

Run `node scripts/test-posts.mjs` for validation and failure-path tests.

Run `npm run dev` to preview locally. This work has not deployed to Vercel.
