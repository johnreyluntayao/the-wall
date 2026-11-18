import { Globe2 } from "@/lib/imports";

export function WallIntro() {
  return (
    <section className="wall-intro" aria-labelledby="wall-heading">
      <div className="intro-eyebrow"><span /> THE GOOD OLD DAYS, STARTING TODAY</div>
      <h1 id="wall-heading">A little space to <em>say something.</em></h1>
      <p>A thought, a memory, a hello. There’s room for it here.</p>
      <div className="landscape" role="img" aria-label="Illustrated sunrise over blue mountains">
        <span className="landscape-sun" /><span className="landscape-cloud cloud-one" /><span className="landscape-cloud cloud-two" />
        <span className="mountain mountain-back" /><span className="mountain mountain-front" />
        <span className="landscape-caption">wish you were here.</span>
        <span className="landscape-stamp">THE WALL<br />POSTCARD No. 001</span>
      </div>
      <div className="intro-bottom"><span><Globe2 size={12} /> A public wall. A shared moment.</span><span>Make yourself at home.</span></div>
    </section>
  );
}
