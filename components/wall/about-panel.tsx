import { Globe2, Heart, MessageSquare, Separator, Sparkles } from "@/lib/imports";

export function AboutPanel() {
  return (
    <aside className="about-panel" id="about" aria-labelledby="about-heading">
      <div className="about-title"><Sparkles size={15} /><h2 id="about-heading">A familiar feeling</h2></div>
      <p className="about-lead">Remember when we just<br /><em>wrote on each other’s walls?</em></p>
      <p>No perfect photos. No big announcements required. Just the little things that made your day.</p>
      <Separator className="my-5" />
      <ul className="about-features">
        <li><Globe2 /><div><strong>Everyone’s welcome</strong><span>No account. Just you.</span></div></li>
        <li><MessageSquare /><div><strong>280 characters of you</strong><span>Small thoughts count, too.</span></div></li>
        <li><Heart /><div><strong>Keep it kind</strong><span>There’s a person on the other side.</span></div></li>
      </ul>
      <div className="daily-prompt"><span>A LITTLE CONVERSATION STARTER</span><p>What’s one small thing that made you smile today?</p><a href="#wall-message">Leave it on the wall <span aria-hidden="true">↗</span></a></div>
      <footer className="site-footer"><strong>the wall.</strong><p>Old-school spirit. A fresh start.</p><span>Made for the moments in between.</span></footer>
    </aside>
  );
}
