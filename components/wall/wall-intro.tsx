import { profile } from "@/lib/profile";

export function WallIntro() {
  return <section className="wall-intro" aria-labelledby="wall-heading">
    <div className="profile-title"><h1 id="wall-heading">{profile.name}</h1></div>
    <p>{profile.bio}</p>
  </section>;
}
