import { Globe2 } from "@/lib/imports";
import type { Post } from "@/lib/posts";
import { UserAvatar } from "./user-avatar";
import { PostPhoto } from "./post-photo";
import { profile } from "@/lib/profile";

export function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at);
  return (
    <article className="post-card" id={"post-" + post.id}>
      <UserAvatar />
      <div className="post-content">
        <div className="post-heading"><h3>{profile.name}</h3><span>wrote on the wall</span></div>
        <time dateTime={post.created_at} title={date.toLocaleString()}>
          {date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          {" at "}{date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
        </time>
        {post.body && <p className="post-message">{post.body}</p>}
        {post.image_path && <PostPhoto path={post.image_path} />}
        <div className="post-meta"><Globe2 size={12} /> Shared with everyone</div>
      </div>
    </article>
  );
}
