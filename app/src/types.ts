export type Tab = "activity" | "work" | "dosh" | "money";

export type Job = {
  id: string;
  emoji: string;
  title: string;
  posterName: string;
  posterHandle: string;
  blurb: string;
  category: string;
  budgetUsd: number;
  cadence: string;
  location: string;
  tags: string[];
  inNetwork: boolean;
};

export type Booking = {
  id: string;
  jobId: string;
  title: string;
  posterName: string;
  posterHandle: string;
  emoji: string;
  agreedUsd: number;
  cadence: string;
  status: string;
  createdAt: string;
};

export type JobCardItem = {
  id: string;
  emoji?: string;
  title: string;
  poster?: string;
  handle?: string;
  budget?: string;
  tags?: string[];
  inNetwork?: boolean;
};

export type DoshCard =
  | {
      type: "receive_usd";
      accountHolder?: string;
      bank?: string;
      accountNumber?: string;
      routingNumber?: string;
      shareMessage?: string;
    }
  | {
      type: "confirm";
      action?: "send" | "convert" | "hold" | "stake" | "chip" | "join" | "fund" | "add_card" | "book";
      title?: string;
      fromLabel?: string;
      toLabel?: string;
      rateLabel?: string;
      feeLabel?: string;
      recipient?: string;
      note?: string;
      effect?: DoshEffect;
    }
  | {
      type: "job_board";
      intro?: string;
      jobs: JobCardItem[];
    }
  | {
      type: "scam_warning";
      reason?: string;
      options?: string[];
    }
  | {
      type: "status";
      title?: string;
      subtitle?: string;
    };

export type DoshEffect = {
  openAccount?: boolean;
  attachCard?: { last4?: string };
  addContact?: { tag?: string; name?: string; relationship?: string; note?: string };
  bookJob?: { jobId?: string };
  usdDelta?: number;
  ngnDelta?: number;
  watch?: string | null;
  kind?: string;
  note?: string;
};

export type Contact = { tag: string; name?: string; relationship?: string; note?: string };
export type Txn = { kind: string; usdDelta: number; ngnDelta: number; note?: string; createdAt: string };

export type AppState = {
  mode: "new" | "returning";
  tag: string;
  name: string;
  usd: number;
  ngn: number;
  nairaPerUsd: number;
  accountOpened: boolean;
  justVerified: boolean;
  watching: string | null;
  cardLast4: string | null;
  contacts: Contact[];
  transactions: Txn[];
  bookings: Booking[];
};

export type DoshResponse = {
  reply: string;
  cards: DoshCard[];
  chips: string[];
  state?: AppState | null;
  offline?: boolean;
  error?: string;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type FeedItem =
  | { kind: "dosh"; text: string; cards?: DoshCard[] }
  | { kind: "user"; text: string };
