# Assessment checklist

## Implemented

- React 19, Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui and Lucide.
- A responsive 2009-inspired profile layout with functional Wall and Info sections.
- Anonymous sharing under the fixed display name Wall Visitor.
- Supabase persistence, newest-first feed, and older-post pagination.
- Supabase Realtime INSERT subscription with ID deduplication.
- A 280-character counter, UI validation, and database constraints.
- Empty, loading, success, error and retry states.
- Keyboard focus styles, visible field labels for assistive technology, and reduced-motion support.

## Verified locally

Using the running app and the real Supabase database:

1. Shared two uniquely labeled test messages through the UI.
2. Confirmed both appeared in another open tab without reloading.
3. Reloaded the posting tab; both messages persisted, newest first.
4. Confirmed Share was disabled for whitespace-only and 281-character input.
5. Checked Info and navigation back to the composer.
6. Inspected the desktop layout and the 390px mobile layout; no horizontal overflow.
7. Removed the two test rows after verification.

The screenshots in `docs/screenshots` show the temporary verification posts.
They are evidence of local testing, not screenshots of a deployed production site.

## Manual Vercel deployment

The owner will run and deploy the project manually.

1. Import the GitHub repository in Vercel using the Next.js preset.
2. Set `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the local environment.
   The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported as a fallback.
3. Deploy, then test Share, refresh, and a second-tab Realtime update on the production URL.
4. Capture desktop and mobile screenshots of that deployed site.
5. Submit the production URL and screenshots required by the assessment.

No login is required. Photo upload is implemented for JPEG, PNG, and WebP
up to 5 MB, with preview/removal before sharing, photo-only posts, persistent
Storage paths, and Realtime delivery. Edit/delete are outside the assessment.

## Personalized profile and photo verification

- Added Johnrey’s supplied photo, bio, birthday, location, and friend count.
- Captured the portfolio homepage for the advertisement; its link opens a new tab.
- Posted a temporary photo through the browser and confirmed another tab received it live.
- Reloaded the posting tab and verified the stored image loaded at its original width.
- Verified unsupported-file handling through the browser.
- Automated checks cover file size/signature/type, character limits, Unicode,
  offline/fetch/upload failures, and idempotent retries.
- Removed the temporary test post. Its unreferenced Storage object
  `5ae23950-9541-4b7b-bcf2-a85bb5ae8324.jpg` remains for administrator cleanup.
  Automatic approval review rejected a temporary anonymous cleanup policy;
  no such policy was applied.
