const STACK = "/scene/stack-wide.jpg";

// Full-screen cinematic hero: the OneDosh marble card family floating through a
// moonlit canyon opening. Just the image, edge to edge — no chrome, no type.
export function StackHero() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#06070a",
        backgroundImage: `url(${STACK})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

export default StackHero;
