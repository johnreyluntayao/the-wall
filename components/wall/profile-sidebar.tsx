import { Globe2, Heart, MessageSquare, Separator, Sun } from "@/lib/imports";
import { UserAvatar } from "./user-avatar";

export function ProfileSidebar() {
  return (
    <aside className="profile-sidebar" aria-label="Wall profile">
      <div className="profile-art"><UserAvatar /><span className="profile-art-caption">EST. NOW · FEELS LIKE 2008</span></div>
      <h2>The Wall</h2>
      <p className="profile-description">Small thoughts.<br />Good company.</p>
      <div className="profile-status"><span /> Open to everyone</div>
      <Separator className="my-5" />
      <nav className="profile-nav" aria-label="Profile navigation">
        <a href="#wall" aria-current="page"><MessageSquare size={17} /> Wall <span>← you are here</span></a>
        <a href="#about"><Globe2 size={17} /> About this space</a>
      </nav>
      <div className="sidebar-note"><Sun size={22} strokeWidth={1.5} /><p>The internet used to feel like a neighborhood.<br /><strong>Let’s bring a little of that back.</strong></p></div>
      <p className="sidebar-signoff"><Heart size={12} /> Less scrolling. More connecting.</p>
    </aside>
  );
}
