import { t, display, limeGlow } from "../theme";
import { Avatar } from "../components/ui";
import { gigThumb } from "../gigs";
import type { Job } from "../types";

// Material 3 detail screen for a single gig: image header, headline, poster,
// tonal metadata chips, description, a "how Dosh handles it" explainer, and a
// pinned bottom action bar with the primary Book CTA.
export function GigDetail({
  job,
  booked,
  onOpenDosh,
}: {
  job: Job;
  booked: boolean;
  onOpenDosh: (prompt: string) => void;
}) {
  const src = gigThumb(job.id);
  const isRetainer = job.tags.includes("retainer") || job.cadence.includes("month");

  const chips: { label: string; tone?: "lime" }[] = [
    { label: isRetainer ? "Retainer" : "One-off" },
    { label: job.category },
    { label: job.location },
  ];
  if (job.inNetwork) chips.push({ label: "In your circle", tone: "lime" });

  return (
    <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
      {/* Bottom padding clears the sticky action bar so the last section stays readable. */}
      <div style={{ paddingBottom: 92 }}>
        {/* Image header */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 190,
            borderRadius: t.radiusCard,
            overflow: "hidden",
            background: t.navy,
            display: "grid",
            placeItems: "center",
          }}
        >
          {src ? (
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ color: t.lime, fontWeight: 800, fontSize: 64 }}>{job.title.slice(0, 1)}</span>
          )}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(12,18,32,0) 40%, rgba(12,18,32,0.55) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 14,
              bottom: 12,
              color: "#fff",
              fontSize: 22,
              fontWeight: 800,
              fontFamily: display,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              paddingRight: 14,
            }}
          >
            {job.title}
          </div>
        </div>

        {/* Poster */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <Avatar label={job.posterName} size={40} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: t.ink }}>{job.posterName}</div>
            <div style={{ fontSize: 12.5, color: t.sub }}>
              {job.posterHandle} · {job.location}
            </div>
          </div>
        </div>

        {/* Pay */}
        <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 30, fontWeight: 800, color: t.green, fontFamily: display, letterSpacing: "-0.02em" }}>
            ${job.budgetUsd.toLocaleString()}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.sub }}>{job.cadence}</span>
        </div>

        {/* Metadata chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {chips.map((c) => (
            <span
              key={c.label}
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                borderRadius: 999,
                padding: "7px 13px",
                color: c.tone === "lime" ? t.limeInk : t.ink,
                background: c.tone === "lime" ? "rgba(207,242,63,0.5)" : "rgba(20,28,51,0.06)",
              }}
            >
              {c.label}
            </span>
          ))}
        </div>

        {/* About */}
        <Section title="About this gig">
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: t.sub }}>{job.blurb}</p>
        </Section>

        {/* How Dosh handles it — the broker story */}
        <Section title="How Dosh handles it">
          <Step n={1} text={`Dosh confirms scope and pay with ${job.posterName.split(" ")[0]} for you.`} />
          <Step n={2} text="You just do the work — no awkward money chats or invoicing." />
          <Step n={3} text="Dosh collects the dollars and drops them straight into your wallet." />
        </Section>
      </div>

      {/* Pinned action bar */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: `linear-gradient(180deg, rgba(233,230,220,0) 0%, ${t.bg} 34%)`,
          paddingTop: 14,
          paddingBottom: 8,
          display: "flex",
          gap: 10,
        }}
      >
        <button
          onClick={() => onOpenDosh(`I've got a question about the "${job.title}" gig from ${job.posterName}`)}
          aria-label="Ask Dosh a question"
          style={{
            flexShrink: 0,
            border: `1px solid ${t.border}`,
            background: "#fff",
            color: t.ink,
            borderRadius: 999,
            padding: "0 18px",
            height: 52,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Ask
        </button>
        {booked ? (
          <div
            style={{
              flex: 1,
              display: "grid",
              placeItems: "center",
              height: 52,
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 800,
              color: t.limeInk,
              background: "rgba(207,242,63,0.5)",
            }}
          >
            Booked 🤝
          </div>
        ) : (
          <button
            onClick={() => onOpenDosh(`Book the "${job.title}" gig from ${job.posterName} (${job.posterHandle})`)}
            style={{
              flex: 1,
              border: "none",
              background: t.lime,
              color: t.limeInk,
              borderRadius: 999,
              height: 52,
              fontSize: 15,
              fontWeight: 800,
              boxShadow: limeGlow,
            }}
          >
            Book with Dosh
          </button>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: t.faint,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
      <div
        style={{
          flexShrink: 0,
          width: 24,
          height: 24,
          borderRadius: 12,
          background: t.navy,
          color: t.lime,
          fontSize: 12.5,
          fontWeight: 800,
          display: "grid",
          placeItems: "center",
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.45, color: t.ink, paddingTop: 2 }}>{text}</div>
    </div>
  );
}
