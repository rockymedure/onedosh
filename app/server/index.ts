import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import { runDosh, hasKey, type ChatMessage, type DoshContext } from "./dosh.ts";
import { generateCardArt, hasFalKey } from "./cards.ts";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 8787);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    key: hasKey(),
    model: process.env.DOSH_MODEL || "claude-opus-4-6",
    cardStudio: hasFalKey(),
  });
});

app.post("/api/card", async (req, res) => {
  const { prompt } = req.body as { prompt?: string };
  if (!hasFalKey()) {
    res.status(200).json({ error: "no_key", message: "Add FAL_KEY to app/.env to mint AI cards." });
    return;
  }
  if (!prompt || !prompt.trim()) {
    res.status(400).json({ error: "empty", message: "Tell me the vibe first." });
    return;
  }
  try {
    const { dataUrl } = await generateCardArt(prompt);
    res.json({ dataUrl });
  } catch (err: any) {
    console.error("Card gen error:", err?.message || err);
    res.status(500).json({ error: "gen_failed", message: err?.message || "Generation failed" });
  }
});

app.post("/api/dosh", async (req, res) => {
  const { messages, context } = req.body as {
    messages: ChatMessage[];
    context: DoshContext;
  };

  if (!hasKey()) {
    res.status(200).json({
      reply:
        "I'm not connected yet — add your ANTHROPIC_API_KEY to app/.env and restart. Then I'll actually think.",
      cards: [],
      chips: [],
      offline: true,
    });
    return;
  }

  try {
    const result = await runDosh(messages, context);
    res.json(result);
  } catch (err: any) {
    console.error("Dosh error:", err?.message || err);
    res.status(500).json({
      reply: "Something went wrong on my end. Try again in a moment.",
      cards: [],
      chips: [],
      error: err?.message || "unknown",
    });
  }
});

// In production, serve the built Vite frontend from the same service and let
// client-side routing fall back to index.html for non-API GET requests.
const clientDir = path.resolve(__dirname, "../dist");
if (fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      res.sendFile(path.join(clientDir, "index.html"));
      return;
    }
    next();
  });
  console.log(`Serving static frontend from ${clientDir}`);
}

app.listen(PORT, () => {
  console.log(`Dosh server on http://localhost:${PORT}  (key: ${hasKey() ? "yes" : "MISSING"})`);
});
