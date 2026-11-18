import { getSupabase } from "./supabase";
import type { Database } from "./database.types";

export type Post = Database["public"]["Tables"]["posts"]["Row"];
export const MAX_POST_LENGTH = 280;
export const countCharacters = (value: string) => Array.from(value).length;

/** Pages are zero-based; stable timestamp/ID ordering puts newest posts first. */
export async function listPosts(page = 0, pageSize = 50): Promise<Post[]> {
  if (!Number.isInteger(page) || page < 0 ||
      !Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error("Use a nonnegative page and a page size from 1 to 100.");
  }
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);
  if (error) throw error;
  return data;
}

export async function createPost(message: string): Promise<Post> {
  const body = message.trim();
  if (!body || countCharacters(body) > MAX_POST_LENGTH) {
    throw new Error("Write a message between 1 and 280 characters.");
  }
  const { data, error } = await getSupabase()
    .from("posts")
    .insert({ body })
    .select()
    .single();
  if (error) throw error;
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
