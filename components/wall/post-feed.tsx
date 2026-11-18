import { ArrowDown, Button, MessageSquare, RefreshCw, Skeleton } from "@/lib/imports";
import type { Post } from "@/lib/posts";
import { PostCard } from "./post-card";

type PostFeedProps = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  live: boolean;
  onRetry: () => void;
  onPageChange: (page: number) => void;
};

export function PostFeed({ posts, loading, error, page, pageCount, live, onRetry, onPageChange }: PostFeedProps) {
  const firstPage = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pageNumbers = Array.from({ length: Math.min(5, pageCount) }, (_, index) => firstPage + index);

  function goToPage(next: number) {
    onPageChange(next);
    const heading = document.getElementById("feed-heading");
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: "start" });
  }

  return (
    <section className="post-feed" aria-labelledby="feed-heading" aria-busy={loading}>
      <div className="feed-heading"><h2 id="feed-heading" tabIndex={-1}>All posts</h2><span className="feed-sort">Newest first <ArrowDown size={12} /></span></div>
      {error && <div className="feed-error" role="alert"><p>{error}</p><Button variant="outline" size="sm" onClick={onRetry}><RefreshCw size={13} /> Try again</Button></div>}
      {loading && posts.length === 0 ? <div role="status" aria-label="Loading posts" className="feed-loading">{[0, 1, 2].map((index) => <div className="loading-row" key={index}><Skeleton className="size-10 rounded-md" /><div className="flex-1 space-y-3"><Skeleton className="h-3 w-32" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-3/4" /></div></div>)}</div> : null}
      {!loading && !error && posts.length === 0 && <div className="empty-feed"><span className="empty-icon"><MessageSquare size={25} strokeWidth={1.4} /></span><h3>Every good conversation starts somewhere.</h3><p>Be the first to leave a little something on the wall.</p><a href="#wall-message">Say hello <span aria-hidden="true">↗</span></a></div>}
      <div>{posts.map((post) => <PostCard key={post.id} post={post} />)}</div>
      {pageCount > 1 && (
        <nav className="feed-pagination" aria-label="Post pages">
          <span aria-live="polite">Page {page} of {pageCount}</span>
          <div className="feed-page-controls">
            <button type="button" onClick={() => goToPage(page - 1)} disabled={page <= 1}>« Previous</button>
            {pageNumbers.map((number) => (
              <button key={number} type="button" aria-current={number === page ? "page" : undefined}
                disabled={number === page} aria-label={`Page ${number}`} onClick={() => goToPage(number)}>
                {number}
              </button>
            ))}
            <button type="button" onClick={() => goToPage(page + 1)} disabled={page >= pageCount}>Next »</button>
          </div>
        </nav>
      )}
      <div className="feed-end"><span className={live ? "connection-dot online" : "connection-dot"} />{live ? "You’re here. You’re up to date." : "Live updates reconnecting. Refresh to check for new posts."}</div>
    </section>
  );
}
