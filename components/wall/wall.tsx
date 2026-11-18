"use client";

import { useWall } from "@/hooks/use-wall";
import { useEffect, useState } from "react";
import { Globe2 } from "@/lib/imports";
import { profile } from "@/lib/profile";
import { PostComposer } from "./post-composer";
import { PostFeed } from "./post-feed";

/** Data orchestration stays here; presentation components receive typed props. */
export function Wall() {
  const wall = useWall();
  const [section, setSection] = useState<"wall" | "info">("wall");
  useEffect(() => {
    function openWall(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('a[href="#wall"], a[href="#wall-message"], a[href="#feed-heading"]');
      if (!link) return;
      event.preventDefault();
      setSection("wall");
      requestAnimationFrame(() => {
        const target = document.querySelector<HTMLElement>(link.hash);
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        if (target instanceof HTMLTextAreaElement) target.focus({ preventScroll: true });
      });
    }
    document.addEventListener("click", openWall);
    return () => document.removeEventListener("click", openWall);
  }, []);
  return (
    <>
      <nav className="profile-tabs" aria-label="Wall sections">
        <button type="button" aria-pressed={section === "wall"} onClick={() => setSection("wall")}>Wall</button>
        <button type="button" aria-pressed={section === "info"} onClick={() => setSection("info")}>Info</button>
        <span><span className={wall.live ? "connection-dot online" : "connection-dot"} />{wall.live ? "Live updates on" : "Connecting…"}</span>
      </nav>
      <div hidden={section !== "wall"}>
      <PostComposer onShare={wall.share} />
      <div className="welcome-note"><Globe2 size={19} /><div><strong>A wall for everyone.</strong><p>You don’t need an account to belong here. Share a thought and join the conversation.</p></div></div>
      <PostFeed posts={wall.posts} loading={wall.loading} error={wall.error}
        live={wall.live} page={wall.page} pageCount={wall.pageCount}
        onRetry={wall.retry} onPageChange={wall.goToPage} />
      </div>
      {section === "info" && <section className="wall-info"><h2>About {profile.name}</h2><p>{profile.bio}</p><dl><dt>Birthday</dt><dd>{profile.birthday}</dd><dt>Location</dt><dd>{profile.location}</dd><dt>Friends</dt><dd>{profile.friends}</dd><dt>Who can post?</dt><dd>Everyone. This demo uses the fixed name Johnrey V. Luntayao and profile photo for all posts; no login is required.</dd><dt>Who can see my posts?</dt><dd>Everyone visiting this wall. Please do not share sensitive information.</dd><dt>Will my message stay?</dt><dd>Yes. Messages and photos are saved and remain after a refresh.</dd><dt>What can I share?</dt><dd>Up to 280 characters and an optional JPEG, PNG, or WebP photo up to 5 MB. Photos can also be shared without a caption.</dd></dl><button type="button" onClick={() => setSection("wall")}>← Back to the wall</button></section>}
    </>
  );
}
