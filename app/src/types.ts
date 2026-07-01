export type Tab = "activity" | "dosh" | "money";

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
      action?: "send" | "convert" | "hold" | "stake" | "chip" | "join";
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
  addContact?: { tag?: string; name?: string; relationship?: string; note?: string };
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
  contacts: Contact[];
  transactions: Txn[];
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
