import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import assert from "node:assert/strict";

nextEnv.loadEnvConfig(process.cwd());
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } },
);
const { error: readError } = await client.from("posts").select("id").limit(1);
assert.ifError(readError);
console.log("Public Data API read passed.");

// Opt in because this leaves one clearly labeled test post in the public feed.
if (process.argv.includes("--write")) {
  const body = "Backend verification " + crypto.randomUUID();
  let resolveEvent;
  const received = new Promise((resolve) => { resolveEvent = resolve; });
  const channel = client.channel("backend-check-" + crypto.randomUUID())
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" },
      ({ new: post }) => { if (post.body === body) resolveEvent(post); });
  let timer;
  try {
    await new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error("Subscription timeout")), 15000);
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") resolve();
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          reject(new Error(status));
        }
      });
    });
    clearTimeout(timer);
    const { data, error } = await client.from("posts").insert({ body }).select().single();
    assert.ifError(error);
    console.log("Created verification post:", data.id);
    const event = await Promise.race([
      received,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Realtime insert timeout")), 45000);
      }),
    ]);
    assert.equal(event.id, data.id);
    console.log("Public insert and Realtime delivery passed.");
    for (const invalid of ["", " ".repeat(4), "x".repeat(281)]) {
      const { error } = await client.from("posts").insert({ body: invalid });
      assert.ok(error, "Invalid body must be rejected");
    }
    console.log("Database body validation passed.");
  } finally {
    clearTimeout(timer);
    await client.removeChannel(channel);
  }
}
