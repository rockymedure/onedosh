import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Landing } from "./brand/Landing";
import { Board } from "./brand/Board";
import { MoneyReveal } from "./brand/MoneyReveal";
import "./index.css";

// Tiny hash router: `#brand` shows the greco-futuristic brand landing page;
// everything else is the phone prototype. Keeps the two fully separate.
function Root() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  // Path-based entry for the marketing hero scene (deployed at /visual), with a
  // #reveal hash kept as a convenience alias.
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/visual"))
    return <MoneyReveal />;
  if (hash.startsWith("#board")) return <Board />;
  if (hash.startsWith("#reveal")) return <MoneyReveal />;
  if (hash.startsWith("#brand")) return <Landing />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
