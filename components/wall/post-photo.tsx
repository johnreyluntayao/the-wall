"use client";

import { useState } from "react";
import { Button, Image, RefreshCw } from "@/lib/imports";
import { getPhotoUrl } from "@/lib/photos";
import { profile } from "@/lib/profile";

export function PostPhoto({ path }: { path: string }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const url = getPhotoUrl(path);
  if (failed) return <div className="photo-error" role="status"><p>This photo couldn’t load.</p><Button variant="outline" size="sm" onClick={() => { setFailed(false); setAttempt((value) => value + 1); }}><RefreshCw size={13} /> Retry photo</Button></div>;
  return <a className="post-photo-link" href={url} target="_blank" rel="noopener noreferrer" aria-label="View attached photo in a new tab">
    <Image key={attempt} src={url + "?retry=" + attempt} alt={"Photo shared by " + profile.name} width={1200} height={900} unoptimized className="post-photo" onError={() => setFailed(true)} />
  </a>;
}
