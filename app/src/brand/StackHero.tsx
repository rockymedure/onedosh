const POSTER = "/scene/stack-wide.jpg";
const VIDEO = "/scene/stack-wide.mp4";

// Full-screen cinematic hero: the OneDosh marble card family floating in a
// moonlit canyon, animated as a slow night time-lapse — the cards hold still
// while time and light move across the scene. Edge to edge, no chrome, no type.
// The still is the poster/fallback for reduced-motion and slow connections.
export function StackHero() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#06070a", overflow: "hidden" }}>
      <video
        src={VIDEO}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
    </div>
  );
}

export default StackHero;
