import { ArrowUpRight } from "@/lib/imports";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#wall" aria-label="The Wall home">the wall<span>.</span></a>
        <span className="header-tagline">a little more human.</span>
        <nav aria-label="Main navigation">
          <a href="#wall" aria-current="page">The Wall</a>
          <a href="#about">About <ArrowUpRight size={13} aria-hidden="true" /></a>
        </nav>
      </div>
    </header>
  );
}
