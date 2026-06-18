export type ScopeDocument = {
  product_name: string;
  tagline: string;
  problem: string;
  target_user: string;
  product_goal: string;
  mvp_features: {
    name: string;
    description: string;
    why: string;
  }[];
  anti_scope: {
    item: string;
    reason: string;
  }[];
  roadmap: {
    phase_1: { title: string; duration: string; actions: string[] };
    phase_2: { title: string; duration: string; actions: string[] };
    phase_3: { title: string; duration: string; actions: string[] };
  };
  tech_stack: {
    recommended: string;
    reason: string;
  }[];
  risks: {
    risk: string;
    mitigation: string;
  }[];
  success_metrics: string[];
  next_move: string;
};

export type Conversation = {
  id: string;
  title: string | null;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type Scope = {
  id: string;
  conversation_id: string;
  title: string | null;
  content: ScopeDocument;
  created_at: string;
};

/* UI-only message type used in the chat component */
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  scopeData?: ScopeDocument;
};
