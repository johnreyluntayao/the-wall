"use client";

import { useWall } from "@/hooks/use-wall";
import { PostComposer } from "./post-composer";
import { PostFeed } from "./post-feed";

/** Data orchestration stays here; presentation components receive typed props. */
export function Wall() {
  const wall = useWall();
  return (
    <>
      <PostComposer onShare={wall.share} />
      <PostFeed posts={wall.posts} loading={wall.loading} error={wall.error}
        live={wall.live} hasMore={wall.hasMore} loadingMore={wall.loadingMore}
        onRetry={wall.retry} onLoadMore={wall.loadMore} />
    </>
  );
}
