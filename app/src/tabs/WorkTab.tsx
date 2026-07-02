import { useEffect, useMemo, useState } from "react";
import { t, display, glass, glassBorder, limeGlow } from "../theme";
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

type Filter = "all" | "retainer" | "oneoff" | "network";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "retainer", label: "Retainers" },
  { id: "oneoff", label: "One-off" },
  { id: "network", label: "In your circle" },
];

export function WorkTab({ mode, onOpenDosh }: { mode: Mode; onOpenDosh: (prompt: string) => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    getJobs().then(setJobs);
    getState(mode).then((s) => setBookings(s?.bookings ?? []));
  }, [mode]);

  const bookedIds = useMemo(() => new Set(bookings.map((b) => b.jobId)), [bookings]);

  const shown = useMemo(() => {
    return jobs.filter((j) => {
      if (filter === "retainer") return j.tags.includes("retainer") || j.cadence.includes("month");
      if (filter === "oneoff") return !(j.tags.includes("retainer") || j.cadence.includes("month"));
      if (filter === "network") return j.inNetwork;
      return true;
    });
  }, [jobs, filter]);

  return (
    <div style={{ height: "100%", overflowY: "auto", paddingBottom: 24 }}>
      <div style={{ padding: "2px 2px 12px" }}>
        <div style={{ fontFamily: display, fontSize: 26, fontWeight: 700, color: t.ink, letterSpacing: "-0.02em" }}>
          Find work<span style={{ color: t.lime }}>.</span>
        </div>
        <div style={{ fontSize: 13.5, color: t.sub, marginTop: 2 }}>
          Real gigs that pay in dollars — straight into your wallet.
        </div>
      </div>

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
        {FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
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
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {shown.map((j) => (
          <GigCard key={j.id} job={j} booked={bookedIds.has(j.id)} onOpenDosh={onOpenDosh} />
        ))}
        {shown.length === 0 && (
          <div style={{ fontSize: 13, color: t.sub, padding: 12, textAlign: "center" }}>
            No gigs in this filter yet.
          </div>
        )}
      </div>
    </div>
  );
}

function GigCard({ job, booked, onOpenDosh }: { job: Job; booked: boolean; onOpenDosh: (p: string) => void }) {
  return (
    <div
      style={{
        ...glass,
        border: job.inNetwork ? `1px solid ${t.lime}` : glassBorder,
        borderRadius: t.radiusInner,
        padding: 14,
        boxShadow: job.inNetwork ? limeGlow : glass.boxShadow,
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
            onClick={() => onOpenDosh(`Book the "${job.title}" gig from ${job.posterName} (${job.posterHandle})`)}
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
