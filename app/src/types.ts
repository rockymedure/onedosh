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
      action?: "send" | "convert" | "hold";
      title?: string;
      fromLabel?: string;
      toLabel?: string;
      rateLabel?: string;
      feeLabel?: string;
      recipient?: string;
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

export type DoshResponse = {
  reply: string;
  cards: DoshCard[];
  chips: string[];
  offline?: boolean;
  error?: string;
};

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type FeedItem =
  | { kind: "dosh"; text: string; cards?: DoshCard[] }
  | { kind: "user"; text: string };
