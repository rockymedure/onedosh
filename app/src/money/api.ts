// Client for the generative Card Studio. Talks to /api/card, which proxies fal.

export async function generateCard(
  prompt: string,
): Promise<{ dataUrl?: string; error?: string; message?: string }> {
  try {
    const res = await fetch("/api/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    return (await res.json()) as { dataUrl?: string; error?: string; message?: string };
  } catch {
    return { error: "network", message: "Couldn't reach the server." };
  }
}
