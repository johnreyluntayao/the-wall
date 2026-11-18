import { getSupabase } from "./supabase";
import type { Database } from "./database.types";
import { uploadPhoto } from "./photos";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export const MAX_POST_LENGTH = 280;
export const countCharacters = (value: string) => Array.from(value).length;

/** Pages are zero-based; stable timestamp/ID ordering puts newest posts first. */
export async function listPosts(page = 0, pageSize = 10, signal?: AbortSignal) {
  if (!Number.isInteger(page) || page < 0 ||
      !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error("Use a nonnegative page and a page size from 1 to 100.");
  }
  const timeout = AbortSignal.timeout(20000);
  const { data, count, error, status } = await getSupabase()
    .from("posts")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1)
    .abortSignal(signal ? AbortSignal.any([signal, timeout]) : timeout);
  // A page may disappear if posts are removed while it is open.
  if (status === 416 && page > 0) return { posts: [], total: count ?? 0 };
  if (error) throw error;
  return { posts: data, total: count ?? data.length };
}

export async function createPost(message: string, photo?: File, requestId = crypto.randomUUID()): Promise<Post> {
  const body = message.trim();
  if ((!body && !photo) || countCharacters(body) > MAX_POST_LENGTH) {
    throw new Error("Add a message or photo, and keep the message within 280 characters.");
  }
  if (typeof navigator !== "undefined" && navigator.onLine === false) throw new Error("You’re offline. Your draft is safe; reconnect and try Share again.");
  const client = getSupabase();
  // Recover a successful insert whose response was lost, without duplicating it.
  const { data: existing, error: lookupError } = await client.from("posts").select("*").eq("id", requestId).abortSignal(AbortSignal.timeout(20000)).maybeSingle();
  if (lookupError) throw new Error("We couldn’t reach the wall. Your draft is safe; please try again.");
  if (existing) return existing;
  const imagePath = photo ? await uploadPhoto(photo, requestId) : null;
  const { data, error } = await client
    .from("posts")
    .insert({ id: requestId, body, image_path: imagePath })
    .select()
    .abortSignal(AbortSignal.timeout(20000))
    .single();
  if (error) throw new Error("We couldn’t confirm your post. Keep this draft and try Share again; it won’t be posted twice.");
  return data;
}

/**
 * Call in a client effect and return the cleanup function.
 * Refetch on every SUBSCRIBED status (including reconnects), and merge posts
 * by ID so an insert response and its Realtime event do not create duplicates.
 */
export function subscribeToPosts(
  onPost: (post: Post) => void,
  onStatus?: (status: string) => void,
) {
  const client = getSupabase();
  const channel = client
    .channel("wall-posts-" + crypto.randomUUID())
    .on<Post>(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      (payload) => onPost(payload.new),
    )
    .subscribe((status) => onStatus?.(status));
  return () => { void client.removeChannel(channel); };
}
