import { Globe2, Heart, MessageSquare, PenLine, Image } from "@/lib/imports";
import { profile } from "@/lib/profile";

export function ProfileSidebar() {
  return <aside className="profile-sidebar" id="profile" aria-label="Wall profile">
    <div className="profile-art"><Image src={profile.photo} alt={profile.name} fill loading="eager" sizes="(max-width: 600px) 54px, (max-width: 900px) 158px, 210px" className="profile-photo" /></div>
    <div className="profile-caption"><strong>{profile.name}</strong><span>{profile.bio}</span></div>
    <nav className="profile-nav" aria-label="Profile navigation">
      <a href="#wall-message"><PenLine size={14} /> Write on the Wall</a>
      <a href="#feed-heading"><MessageSquare size={14} /> View all posts</a>
      <a href="#about"><Globe2 size={14} /> About this wall</a>
    </nav>
    <section className="sidebar-section"><h2>Information</h2><dl>
      <dt>Bio</dt><dd>{profile.bio}</dd>
      <dt>Birthday</dt><dd>{profile.birthday}</dd>
      <dt>Current city</dt><dd>{profile.location}</dd>
    </dl></section>
    <section className="sidebar-section"><h2>Friends <span className="friend-count">({profile.friends})</span></h2><p>{profile.friends} friends · A little connection goes a long way.</p></section>
    <section className="sidebar-section"><h2>A note from the wall</h2><p>Remember when a status was just a status? No pressure. No perfect caption. Just you.</p><span className="sidebar-signoff"><Heart size={12} /> It’s good to have you here.</span></section>
  </aside>;
}
