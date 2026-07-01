import "dotenv/config";
import express from "express";
import cors from "cors";
import { runDosh, hasKey, type ChatMessage, type DoshContext } from "./dosh.ts";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 8787);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, key: hasKey(), model: process.env.DOSH_MODEL || "claude-opus-4-6" });
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

app.listen(PORT, () => {
  console.log(`Dosh server on http://localhost:${PORT}  (key: ${hasKey() ? "yes" : "MISSING"})`);
});
