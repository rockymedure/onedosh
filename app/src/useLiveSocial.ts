import { useEffect, useRef, useState } from "react";
import {
  gamePool as seedPool,
  seedFeed,
  squads as seedSquads,
  nextEvent,
  nairaShort,
  roster,
  p,
  type FeedEvent,
  type GamePool,
  type Squad,
} from "./social";

const FEED_MAX = 24;
const FEED_EVERY = 3600;
const POT_EVERY = 2600;

// A tiny always-on simulation so the network genuinely feels alive:
// money keeps flowing into the feed, squad pots tick up, and the game pool grows.
export function useLiveSocial() {
  const [feed, setFeed] = useState<FeedEvent[]>(seedFeed);
  const [squads, setSquads] = useState<Squad[]>(() => seedSquads.map((s) => ({ ...s })));
  const [pool, setPool] = useState<GamePool>(() => ({ ...seedPool, options: seedPool.options.map((o) => ({ ...o })) }));
  const [onlineIds] = useState<string[]>(() => roster.slice(0, 5));

  const paused = useRef(false);

  useEffect(() => {
    const feedTimer = setInterval(() => {
      if (paused.current) return;
      setFeed((prev) => {
        const ev = nextEvent();
        const aged = prev.map((e) => (e.fresh ? { ...e, fresh: false, ago: e.ago === "now" ? "now" : e.ago } : e));
        return [ev, ...aged].slice(0, FEED_MAX);
      });
    }, FEED_EVERY);

    const potTimer = setInterval(() => {
      if (paused.current) return;
      // Nudge a random squad pot upward + refresh its "who just paid" note.
      setSquads((prev) => {
        const i = Math.floor(Math.random() * prev.length);
        return prev.map((s, idx) => {
          if (idx !== i) return s;
          const bump = [1000, 2000, 3000, 5000][Math.floor(Math.random() * 4)];
          const who = p(s.members[Math.floor(Math.random() * s.members.length)]);
          const pot = Math.min(s.goal, s.pot + bump);
          return { ...s, pot, note: `${who.name} dropped ${nairaShort(bump)}` };
        });
      });
      // Grow the game pool on a random side.
      setPool((prev) => {
        const j = Math.floor(Math.random() * prev.options.length);
        return {
          ...prev,
          options: prev.options.map((o, idx) => (idx === j ? { ...o, stake: o.stake + prev.entry } : o)),
        };
      });
    }, POT_EVERY);

    return () => {
      clearInterval(feedTimer);
      clearInterval(potTimer);
    };
  }, []);

  function react(id: number, emoji: string) {
    setFeed((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const existing = e.reactions.find((r) => r.emoji === emoji);
        const reactions = existing
          ? e.reactions.map((r) => (r.emoji === emoji ? { ...r, count: r.count + 1 } : r))
          : [...e.reactions, { emoji, count: 1 }];
        return { ...e, reactions };
      }),
    );
  }

  function chip(squadId: string, amount: number) {
    setSquads((prev) =>
      prev.map((s) =>
        s.id === squadId ? { ...s, pot: Math.min(s.goal, s.pot + amount), note: `You dropped ${nairaShort(amount)}` } : s,
      ),
    );
  }

  const poolTotal = pool.options.reduce((sum, o) => sum + o.stake, 0);

  return { feed, squads, pool, poolTotal, onlineIds, react, chip };
}
