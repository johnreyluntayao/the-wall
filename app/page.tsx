import { AboutPanel, ProfileSidebar, SiteHeader, Wall, WallIntro } from "@/components/wall";

export default function Home() {
  return (
    <>
      <a href="#wall-message" className="skip-link">Skip to writing a message</a>
      <SiteHeader />
      <main className="wall-layout">
        <ProfileSidebar />
        <div className="wall-main" id="wall">
          <WallIntro />
          <Wall />
        </div>
        <AboutPanel />
      </main>
      <div className="page-bottom"><span>the wall.</span><p>A little less noise. A little more us.</p><span>✳</span></div>
    </>
  );
}
