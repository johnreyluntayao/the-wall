import { ArrowDown, Button, MessageSquare, RefreshCw, Skeleton } from "@/lib/imports";
import type { Post } from "@/lib/posts";
import { PostCard } from "./post-card";

type PostFeedProps = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  live: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
};

export function PostFeed({ posts, loading, error, hasMore, loadingMore, live, onRetry, onLoadMore }: PostFeedProps) {
  return (
    <section className="post-feed" aria-labelledby="feed-heading" aria-busy={loading}>
      <div className="feed-heading"><h2 id="feed-heading">The latest on the wall</h2><span className="feed-sort">Newest first <ArrowDown size={12} /></span></div>
      {error && <div className="feed-error" role="alert"><p>{error}</p><Button variant="outline" size="sm" onClick={onRetry}><RefreshCw size={13} /> Try again</Button></div>}
      {loading && posts.length === 0 ? <div role="status" aria-label="Loading posts" className="feed-loading">{[0, 1, 2].map((index) => <div className="loading-row" key={index}><Skeleton className="size-10 rounded-md" /><div className="flex-1 space-y-3"><Skeleton className="h-3 w-32" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-3/4" /></div></div>)}</div> : null}
      {!loading && !error && posts.length === 0 && <div className="empty-feed"><span className="empty-icon"><MessageSquare size={25} strokeWidth={1.4} /></span><h3>Every good conversation starts somewhere.</h3><p>Be the first to leave a little something on the wall.</p><a href="#wall-message">Say hello <span aria-hidden="true">↗</span></a></div>}
      <div>{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {hasMore && <Button variant="outline" className="load-more" disabled={loadingMore} onClick={onLoadMore}>{loadingMore ? "Loading…" : "Older posts"}<ArrowDown size={14} /></Button>}
      <div className="feed-end"><span className={live ? "connection-dot online" : "connection-dot"} />{live ? "You’re here. You’re up to date." : "Live updates reconnecting. Refresh to check for new posts."}</div>
    </section>
  );
}
