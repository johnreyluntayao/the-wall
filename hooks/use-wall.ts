"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPost, listPosts, subscribeToPosts, type Post } from "@/lib/posts";

const PAGE_SIZE = 50;

function mergePosts(current: Post[], incoming: Post[]) {
  const unique = new Map(current.map((post) => [post.id, post]));
  incoming.forEach((post) => unique.set(post.id, post));
  return [...unique.values()].sort((a, b) =>
    b.created_at.localeCompare(a.created_at) || b.id.localeCompare(a.id));
}

export function useWall() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [revision, setRevision] = useState(0);
  const nextPage = useRef(1);
  const loadingPage = useRef(false);

  useEffect(() => {
    let active = true;
    let fetching = false;
    let refreshAgain = false;
    async function refresh() {
      if (fetching) { refreshAgain = true; return; }
      fetching = true;
      try {
        const latest = await listPosts(0, PAGE_SIZE);
        if (!active) return;
        setPosts((current) => mergePosts(current, latest));
        if (nextPage.current === 1) setHasMore(latest.length === PAGE_SIZE);
        setError(null);
      } catch {
        if (active) setError("We couldn’t load the wall. Please try again.");
      } finally {
        fetching = false;
        if (active) {
          setLoading(false);
          if (refreshAgain) { refreshAgain = false; void refresh(); }
        }
      }
    }
    const unsubscribe = subscribeToPosts(
      (post) => { if (active) setPosts((current) => mergePosts(current, [post])); },
      (status) => {
        if (!active) return;
        setLive(status === "SUBSCRIBED");
        if (status === "SUBSCRIBED") void refresh();
      },
    );
    void refresh();
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("focus", onFocus);
    };
  }, [revision]);

  const share = useCallback(async (message: string) => {
    const post = await createPost(message);
    setPosts((current) => mergePosts(current, [post]));
  }, []);

  async function loadMore() {
    if (loadingPage.current) return;
    loadingPage.current = true;
    setLoadingMore(true);
    try {
      const older = await listPosts(nextPage.current, PAGE_SIZE);
      setPosts((current) => mergePosts(current, older));
      nextPage.current += 1;
      setHasMore(older.length === PAGE_SIZE);
      setError(null);
    } catch {
      setError("We couldn’t load older posts. Please try Older posts again.");
    } finally {
      loadingPage.current = false;
      setLoadingMore(false);
    }
  }

  return { posts, loading, error, live, hasMore, loadingMore, share, loadMore,
    retry: () => { setLoading(true); setRevision((value) => value + 1); } };
}
