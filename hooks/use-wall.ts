"use client";

import { useCallback, useEffect, useState } from "react";
import { createPost, listPosts, subscribeToPosts, type Post } from "@/lib/posts";

const PAGE_SIZE = 10;

type FeedPage = { page: number; posts: Post[]; pageCount: number };

export function useWall() {
  const [page, setPage] = useState(1);
  const [feed, setFeed] = useState<FeedPage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadPage() {
      try {
        const { posts, total } = await listPosts(page - 1, PAGE_SIZE, controller.signal);
        if (controller.signal.aborted) return;
        const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
        setError(null);
        if (page > pageCount) {
          setPage(pageCount);
          return;
        }
        setFeed({ page, posts, pageCount });
      } catch {
        if (!controller.signal.aborted) setError("We couldn’t load this page. Please try again.");
      }
    }
    void loadPage();
    return () => controller.abort();
  }, [page, revision]);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    try {
      unsubscribe = subscribeToPosts(
        () => { if (active) refresh(); },
        (status) => {
          if (!active) return;
          setLive(status === "SUBSCRIBED");
          if (status === "SUBSCRIBED") refresh();
        },
      );
    } catch {
      // Feed loading below surfaces configuration/network errors with Retry.
    }
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
    };
  }, [refresh]);

  const share = useCallback(async (message: string, photo?: File, requestId?: string) => {
    await createPost(message, photo, requestId);
    setPage(1);
    setError(null);
    refresh();
  }, [refresh]);

  const current = feed?.page === page ? feed : null;
  return {
    posts: current?.posts ?? [],
    loading: !current && !error,
    error,
    live,
    page,
    pageCount: feed?.pageCount ?? 1,
    share,
    goToPage: (next: number) => {
      setError(null);
      setPage(next);
    },
    retry: () => {
      setError(null);
      refresh();
    },
  };
}
