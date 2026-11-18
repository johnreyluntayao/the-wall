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
      <footer className="page-bottom"><span>The Wall · A little like 2009.</span><p>Made for the moments in between.</p><a href="#wall">Back to top ↑</a></footer>
    </>
  );
}
