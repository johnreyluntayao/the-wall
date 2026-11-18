import { Globe2, Heart, MessageSquare, Image } from "@/lib/imports";
import { profile } from "@/lib/profile";

export function AboutPanel() {
  return <aside className="about-panel" id="about" aria-labelledby="about-heading">
    <h2 className="rail-heading" id="about-heading">Advertisement</h2>
    <section className="rail-story portfolio-ad">
      <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" aria-label="Visit Johnrey’s Portfolio (opens in a new tab)">
        <h3>Johnrey&apos;s Portfolio</h3>
        <Image src="/portfolio-preview.jpg" alt="Johnrey’s portfolio homepage — UI/UX design and web development" width={1200} height={800} sizes="(max-width: 600px) 45vw, 180px" />
        <p>Thoughtful interfaces. Reliable web products. Explore my UI/UX design and full-stack development work.</p>
        <span className="portfolio-cta">Visit my portfolio ↗</span>
      </a>
    </section>
    <section className="rail-story"><h3>Everyone’s invited</h3>
      <ul className="about-features">
        <li><Globe2 /><span>No account needed.</span></li>
        <li><MessageSquare /><span>280 characters. All you.</span></li>
        <li><Heart /><span>Good thoughts. Kind words.</span></li>
      </ul>
      <p>All posts are public. Please keep personal information private.</p>
    </section>
    <section className="daily-prompt"><span>TODAY’S CONVERSATION STARTER</span>
      <h3>What song takes you straight back to 2009?</h3>
      <a href="#wall-message">Write it on the wall <span aria-hidden="true">›</span></a>
    </section>
    <p className="rail-footnote">An independent tribute to the early social web. Not affiliated with Facebook or Meta.</p>
  </aside>;
}
