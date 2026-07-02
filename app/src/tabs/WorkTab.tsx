import { useEffect, useMemo, useState } from "react";
import { t, glass, glassBorder, limeGlow } from "../theme";
import { getJobs, getState, type Mode } from "../dosh/api";
import { gigThumb } from "../gigs";
import type { Booking, Job } from "../types";

function Thumb({ id, title, size }: { id?: string; title: string; size: number }) {
  const src = gigThumb(id);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        overflow: "hidden",
        flexShrink: 0,
        background: t.navy,
        display: "grid",
        placeItems: "center",
      }}
    >
      {src ? (
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ color: t.lime, fontWeight: 800, fontSize: size * 0.42 }}>
          {title.slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}

// Skill-set families. Each raw job `category` maps into one of these so the
// board reads as a few meaningful sections instead of one gig per header.
type FamilyId = "video" | "design" | "writing" | "dev" | "audio" | "business" | "more";
type ChipId = "all" | "network" | FamilyId;

const FAMILIES: { id: FamilyId; label: string; emoji: string; cats: string[] }[] = [
  { id: "video", label: "Video & Motion", emoji: "🎬", cats: ["Video editing", "Creator"] },
  { id: "design", label: "Design", emoji: "🎨", cats: ["Design"] },
  { id: "writing", label: "Writing", emoji: "✍️", cats: ["Writing"] },
  { id: "dev", label: "Development", emoji: "💻", cats: ["Development"] },
  { id: "audio", label: "Audio & Music", emoji: "🎧", cats: ["Audio", "Music"] },
  { id: "business", label: "Business & Admin", emoji: "🗂️", cats: ["Assistant", "Finance"] },
];

export function WorkTab({
  mode,
  onOpenDosh,
  onOpenGig,
}: {
  mode: Mode;
  onOpenDosh: (prompt: string) => void;
  onOpenGig: (job: Job, booked: boolean) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<ChipId>("all");

  useEffect(() => {
    getJobs().then(setJobs);
    getState(mode).then((s) => setBookings(s?.bookings ?? []));
  }, [mode]);

  const bookedIds = useMemo(() => new Set(bookings.map((b) => b.jobId)), [bookings]);

  // Group every gig into its skill family (keeping FAMILIES order), plus a
  // catch-all for any category we haven't mapped yet. Empty families drop out.
  const sections = useMemo(() => {
    const byFamily = new Map<FamilyId, Job[]>();
    for (const j of jobs) {
      const fam = FAMILIES.find((f) => f.cats.includes(j.category))?.id ?? "more";
      const list = byFamily.get(fam) ?? [];
      list.push(j);
      byFamily.set(fam, list);
    }
    const ordered = [
      ...FAMILIES,
      { id: "more" as FamilyId, label: "More gigs", emoji: "✨", cats: [] as string[] },
    ];
    return ordered
      .map((f) => ({ id: f.id, label: f.label, emoji: f.emoji, jobs: byFamily.get(f.id) ?? [] }))
      .filter((s) => s.jobs.length > 0);
  }, [jobs]);

  const netJobs = useMemo(() => jobs.filter((j) => j.inNetwork), [jobs]);

  const chips: { id: ChipId; label: string; emoji?: string }[] = [
    { id: "all", label: "All" },
    ...(netJobs.length ? [{ id: "network" as ChipId, label: "In your circle", emoji: "⭐" }] : []),
    ...sections.map((s) => ({ id: s.id as ChipId, label: s.label, emoji: s.emoji })),
  ];

  const visibleSections =
    filter === "all"
      ? sections
      : filter === "network"
        ? [{ id: "network" as ChipId, label: "In your circle", emoji: "⭐", jobs: netJobs }]
        : sections.filter((s) => s.id === filter);

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 24 }}>
      {bookings.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <SectionLabel>Your gigs</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {bookings.map((b) => (
              <div
                key={b.id}
                style={{
                  ...glass,
                  border: `1px solid ${t.lime}`,
                  borderRadius: t.radiusInner,
                  padding: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: limeGlow,
                }}
              >
                <Thumb id={b.jobId} title={b.title} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 13.5, color: t.ink }}>{b.title}</div>
                  <div style={{ fontSize: 12, color: t.sub }}>
                    {b.posterName} · ${b.agreedUsd.toLocaleString()} {b.cadence}
                  </div>
                </div>
                <button
                  onClick={() => onOpenDosh(`What's the status on my "${b.title}" gig with ${b.posterName}?`)}
                  style={{
                    border: "none",
                    background: t.navy,
                    color: "#fff",
                    borderRadius: 999,
                    padding: "8px 12px",
                    fontSize: 12,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Status
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 2px 12px" }}>
        {chips.map((c) => {
          const on = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                border: on ? "none" : glassBorder,
                background: on ? t.navy : glass.background,
                backdropFilter: glass.backdropFilter,
                color: on ? "#fff" : t.navy,
                borderRadius: 999,
                padding: "7px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {c.emoji && <span style={{ fontSize: 13 }}>{c.emoji}</span>}
              {c.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {visibleSections.map((sec) => (
          <div key={sec.id}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 2px 10px" }}>
              <span style={{ fontSize: 16 }}>{sec.emoji}</span>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: t.ink, letterSpacing: "-0.01em" }}>
                {sec.label}
              </span>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 800,
                  color: t.sub,
                  background: "rgba(20,28,51,0.07)",
                  borderRadius: 999,
                  minWidth: 20,
                  textAlign: "center",
                  padding: "2px 7px",
                }}
              >
                {sec.jobs.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sec.jobs.map((j) => (
                <GigCard
                  key={j.id}
                  job={j}
                  booked={bookedIds.has(j.id)}
                  onOpenDosh={onOpenDosh}
                  onOpenGig={onOpenGig}
                />
              ))}
            </div>
          </div>
        ))}
        {visibleSections.length === 0 && (
          <div style={{ fontSize: 13, color: t.sub, padding: 12, textAlign: "center" }}>
            No gigs here yet.
          </div>
        )}
      </div>
    </div>
  );
}

function GigCard({
  job,
  booked,
  onOpenDosh,
  onOpenGig,
}: {
  job: Job;
  booked: boolean;
  onOpenDosh: (p: string) => void;
  onOpenGig: (job: Job, booked: boolean) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenGig(job, booked)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenGig(job, booked);
      }}
      style={{
        ...glass,
        border: job.inNetwork ? `1px solid ${t.lime}` : glassBorder,
        borderRadius: t.radiusInner,
        padding: 14,
        boxShadow: job.inNetwork ? limeGlow : glass.boxShadow,
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Thumb id={job.id} title={job.title} size={64} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, fontSize: 15, color: t.ink }}>{job.title}</span>
            {job.inNetwork && (
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 800,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                  color: t.limeInk,
                  background: "rgba(207,242,63,0.5)",
                  borderRadius: 6,
                  padding: "2px 6px",
                }}
              >
                In your circle
              </span>
            )}
          </div>
          <div style={{ fontSize: 12.5, color: t.sub, marginTop: 2 }}>
            {job.posterName} · {job.posterHandle} · {job.location}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 13, color: t.sub, lineHeight: 1.45, marginTop: 8 }}>{job.blurb}</div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: t.green }}>
          ${job.budgetUsd.toLocaleString()}
          <span style={{ fontSize: 12, fontWeight: 600, color: t.sub }}> {job.cadence}</span>
        </div>
        {booked ? (
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 800,
              color: t.limeInk,
              background: "rgba(207,242,63,0.5)",
              borderRadius: 999,
              padding: "9px 16px",
            }}
          >
            Booked 🤝
          </span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDosh(`Book the "${job.title}" gig from ${job.posterName} (${job.posterHandle})`);
            }}
            style={{
              border: "none",
              background: t.lime,
              color: t.limeInk,
              borderRadius: 999,
              padding: "10px 18px",
              fontSize: 13.5,
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color: t.faint,
        margin: "0 2px 8px",
      }}
    >
      {children}
    </div>
  );
}
