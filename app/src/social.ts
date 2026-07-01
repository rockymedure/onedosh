import { t } from "./theme";

// ---------------------------------------------------------------------------
// People — the social graph around Tobi. Every face has a memoji in /avatars.
// ---------------------------------------------------------------------------
export type SocialPerson = { id: string; name: string; tag: string; photo: string; tone: string };

export const people: Record<string, SocialPerson> = {
  tobi: { id: "tobi", name: "You", tag: "@tobi", photo: "/avatars/tobi.png", tone: t.navy },
  mike: { id: "mike", name: "Mike", tag: "@mike", photo: "/avatars/mike.png", tone: t.coral },
  ada: { id: "ada", name: "Ada", tag: "@ada", photo: "/avatars/ada.png", tone: t.violet },
  kelvin: { id: "kelvin", name: "Kelvin", tag: "@kelvin", photo: "/avatars/kelvin.png", tone: t.blue },
  zara: { id: "zara", name: "Zara", tag: "@zara", photo: "/avatars/zara.png", tone: t.green },
  deji: { id: "deji", name: "Deji", tag: "@deji", photo: "/avatars/deji.png", tone: t.blue },
  ngozi: { id: "ngozi", name: "Ngozi", tag: "@ngozi", photo: "/avatars/ngozi.png", tone: t.coral },
  bella: { id: "bella", name: "Bella", tag: "@bella", photo: "/avatars/bella.png", tone: t.limeInk },
  tunde: { id: "tunde", name: "Tunde", tag: "@tunde", photo: "/avatars/tunde.png", tone: t.violet },
};

export const roster = ["ada", "kelvin", "zara", "deji", "ngozi", "bella", "tunde", "mike"];

export function p(id: string): SocialPerson {
  return people[id] ?? people.tobi;
}

// Faces for the <Avatar>/<AvatarStack> components.
export function faces(ids: string[]) {
  return ids.map((id) => ({ label: p(id).name, photo: p(id).photo }));
}

// ---------------------------------------------------------------------------
// Squads — groups that move money together (ajo / splits / trip funds).
// ---------------------------------------------------------------------------
// A milestone unlocks a cash boost once the pot passes `at`. Boosts are funded
// by the stablecoin APY the pooled balance earns while it sits in the squad.
export type Milestone = { at: number; boost: number };

export type Squad = {
  id: string;
  name: string;
  emoji: string;
  kind: string;
  tone: string;
  members: string[];
  goal: number;
  pot: number;
  note: string;
  apy: number;
  milestones: Milestone[];
};

// Sum of boosts already unlocked (yield paid into the pot so far).
export function earnedBoost(s: Squad): number {
  return s.milestones.filter((m) => s.pot >= m.at).reduce((sum, m) => sum + m.boost, 0);
}

// The next boost the squad is climbing toward, or null once fully boosted.
export function nextMilestone(s: Squad): Milestone | null {
  return s.milestones.find((m) => s.pot < m.at) ?? null;
}

export const squads: Squad[] = [
  {
    id: "leadcity",
    name: "Lead City Squad",
    emoji: "🎓",
    kind: "Weekly ajo · your week next",
    tone: t.violet,
    members: ["ada", "kelvin", "deji", "tunde", "tobi"],
    goal: 500_000,
    pot: 340_000,
    note: "Ada dropped ₦5,000",
    apy: 0.052,
    milestones: [
      { at: 250_000, boost: 4_000 },
      { at: 400_000, boost: 7_500 },
      { at: 500_000, boost: 12_000 },
    ],
  },
  {
    id: "studio",
    name: "Studio Rent",
    emoji: "🎬",
    kind: "Monthly split · 3 people",
    tone: t.blue,
    members: ["tobi", "zara", "bella"],
    goal: 180_000,
    pot: 132_000,
    note: "Bella paid her share",
    apy: 0.05,
    milestones: [
      { at: 90_000, boost: 1_500 },
      { at: 180_000, boost: 4_000 },
    ],
  },
  {
    id: "detty",
    name: "Detty December",
    emoji: "🌴",
    kind: "Trip fund · Lagos link-up",
    tone: t.coral,
    members: ["ada", "ngozi", "tunde", "kelvin", "zara", "deji"],
    goal: 1_200_000,
    pot: 690_000,
    note: "Ngozi joined the fund",
    apy: 0.058,
    milestones: [
      { at: 400_000, boost: 6_000 },
      { at: 800_000, boost: 15_000 },
      { at: 1_200_000, boost: 30_000 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Game — a live prediction pool. World Cup energy: back a side, win the pot.
// ---------------------------------------------------------------------------
export type PoolOption = { id: string; label: string; flag: string; backers: string[]; stake: number };
export type GamePool = {
  id: string;
  title: string;
  subtitle: string;
  entry: number;
  closesIn: string;
  options: PoolOption[];
};

export const gamePool: GamePool = {
  id: "naija-brazil",
  title: "🇳🇬 Naija vs Brazil 🇧🇷",
  subtitle: "Friendly · kickoff 8:00pm",
  entry: 2_000,
  closesIn: "closes in 1h 42m",
  options: [
    { id: "naija", label: "Naija win", flag: "🇳🇬", backers: ["ada", "kelvin", "deji", "tunde"], stake: 84_000 },
    { id: "draw", label: "Draw", flag: "🤝", backers: ["zara"], stake: 22_000 },
    { id: "brazil", label: "Brazil win", flag: "🇧🇷", backers: ["bella", "ngozi"], stake: 46_000 },
  ],
};

// ---------------------------------------------------------------------------
// Live feed — the social money stream that keeps moving.
// ---------------------------------------------------------------------------
export type Reaction = { emoji: string; count: number };
export type FeedEvent = {
  id: number;
  actor: string;
  target?: string;
  squad?: string;
  kind: "send" | "chip" | "join" | "win" | "split" | "request" | "cheer";
  emoji: string;
  amount?: number;
  text: string;
  tone: string;
  reactions: Reaction[];
  ago: string;
  fresh?: boolean;
};

export function nairaShort(n: number) {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
  if (n >= 1_000) return `₦${Math.round(n / 1_000)}k`;
  return `₦${n}`;
}

const REACT_PALETTE = ["🔥", "😂", "🙌", "💸", "⚽️", "👀", "🐐"];
function seedReactions(): Reaction[] {
  const n = 1 + Math.floor(Math.random() * 2);
  const picks = [...REACT_PALETTE].sort(() => Math.random() - 0.5).slice(0, n);
  return picks.map((emoji) => ({ emoji, count: 1 + Math.floor(Math.random() * 18) }));
}

let SEQ = 100;

// Templates the simulator draws from to keep the feed feeling human + varied.
function makeEvent(): FeedEvent {
  const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const twoPeople = () => {
    const a = pick(roster);
    let b = pick(roster);
    while (b === a) b = pick(roster);
    return [a, b] as const;
  };
  const kinds = ["send", "chip", "join", "win", "split", "request", "cheer"] as const;
  const kind = pick(kinds);
  const amt = pick([500, 1000, 1500, 2000, 3000, 5000, 8000, 12000, 20000]);

  let actor: string, target: string | undefined, squad: string | undefined, emoji: string, text: string, tone: string;

  switch (kind) {
    case "send": {
      const [a, b] = twoPeople();
      actor = a; target = b; emoji = "💸"; tone = t.green;
      text = `sent ${p(b).name} ${nairaShort(amt)}`;
      break;
    }
    case "chip": {
      actor = pick(roster); squad = pick(squads).name; emoji = "🫱"; tone = t.violet;
      text = `chipped ${nairaShort(amt)} into ${squad}`;
      break;
    }
    case "join": {
      actor = pick(roster); squad = pick([...squads.map((s) => s.name), gamePool.title]); emoji = "✨"; tone = t.blue;
      text = `joined ${squad}`;
      break;
    }
    case "win": {
      actor = pick(roster); emoji = "🏆"; tone = t.gold;
      text = `won ${nairaShort(amt * 3)} in the ${pick(["FIFA", "predictions", "Naija vs Brazil"])} pool`;
      break;
    }
    case "split": {
      const [a, b] = twoPeople();
      actor = a; target = b; emoji = "🍽️"; tone = t.coral;
      text = `split ${pick(["suya", "the studio session", "fuel", "data", "shawarma"])} with ${p(b).name} · ${nairaShort(amt)}`;
      break;
    }
    case "request": {
      const [a, b] = twoPeople();
      actor = a; target = b; emoji = "🙏"; tone = t.blue;
      text = `requested ${nairaShort(amt)} from ${p(b).name}`;
      break;
    }
    default: {
      actor = pick(roster); emoji = pick(["🔥", "⚽️", "🎮", "🙌"]); tone = t.navy;
      text = pick(["is hyped for kickoff", "is live gaming", "started a challenge", "is on a 6-day streak"]);
    }
  }

  return {
    id: ++SEQ,
    actor, target, squad, kind, emoji, tone,
    amount: kind === "cheer" ? undefined : amt,
    text,
    reactions: seedReactions(),
    ago: "now",
    fresh: true,
  };
}

export function nextEvent(): FeedEvent {
  return makeEvent();
}

export const seedFeed: FeedEvent[] = [
  { id: 1, actor: "ada", target: "kelvin", kind: "send", emoji: "💸", tone: t.green, amount: 5000, text: "sent Kelvin ₦5k", reactions: [{ emoji: "🔥", count: 12 }, { emoji: "🙌", count: 4 }], ago: "just now" },
  { id: 2, actor: "deji", squad: "Lead City Squad", kind: "chip", emoji: "🫱", tone: t.violet, amount: 5000, text: "chipped ₦5k into Lead City Squad", reactions: [{ emoji: "💸", count: 7 }], ago: "2m" },
  { id: 3, actor: "zara", kind: "win", emoji: "🏆", tone: t.gold, amount: 36000, text: "won ₦36k in the FIFA pool", reactions: [{ emoji: "🐐", count: 21 }, { emoji: "😂", count: 6 }], ago: "5m" },
  { id: 4, actor: "bella", target: "tunde", kind: "split", emoji: "🍽️", tone: t.coral, amount: 3000, text: "split suya with Tunde · ₦3k", reactions: [{ emoji: "😂", count: 9 }], ago: "8m" },
  { id: 5, actor: "ngozi", squad: "Detty December", kind: "join", emoji: "✨", tone: t.blue, text: "joined Detty December", reactions: [{ emoji: "🌴", count: 5 }], ago: "12m" },
];
