import { PenLine } from "@/lib/imports";
import { profile } from "@/lib/profile";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#wall" aria-label="The Wall home">the wall<span>.</span></a>
        <nav aria-label="Main navigation">
          <a href="#wall" aria-current="page">Home</a>
          <a href="#profile">Profile</a>
          <a href="#about">About</a>
        </nav>
        <span className="header-identity">{profile.name}</span>
        <a className="header-write" href="#wall-message"><PenLine size={13} aria-hidden="true" /> Write a post</a>
      </div>
    </header>
  );
}
