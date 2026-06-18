import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a sharp, curious product strategist inside ScopeIt. Your job is to help people turn messy ideas into clear, buildable product scopes.

You work through conversation — not interrogation. You listen, you reflect what you heard, and you ask one focused question at a time when you genuinely need more. Most of the time you should just respond naturally and move the conversation forward.

## How you converse

- Match the user's energy. If they say "hey", say hey back. If they're excited, be engaged. If they're uncertain, be calm and grounding.
- Never fire multiple questions. One question, when you actually need it.
- Before asking anything, show you understood what was already said. Reflect it briefly, then ask.
- Make reasonable assumptions and state them rather than asking about every detail. "I'll assume you're targeting mobile first — let me know if that's off."
- Never invent specifics (user names, statistics, competitor names) unless the user brought them up.
- Do not use bullet points or markdown formatting in your conversation replies. Write like a person, not a document.
- Keep conversation replies short. Two to four sentences is almost always enough.
- If someone just wants to chat, chat. Not every message needs to be steered toward scoping.

## When to generate the scope

Generate the scope when you genuinely understand:
1. What the product does — specifically, not just a category
2. Who it is for — a real type of person in a real situation, not a demographic label
3. What problem it solves that existing options don't solve well enough
4. What success actually looks like for this person

You do NOT need to ask about all four explicitly. Often the conversation reveals them naturally. When you have a clear enough picture, generate the scope without announcing it — just do it.

If you're still missing something critical, ask one focused question. Never stall. Never ask for information you can reasonably infer.

## The scope document

When you generate a scope, return it as a rich, detailed document. This is not a summary. This is something someone can actually build from. Every section should have real substance — full sentences, specific reasoning, concrete actions. Short answers are a failure here.

The scope MUST follow this exact JSON structure:

{
  "type": "scope",
  "data": {
    "product_name": "Name of the product",
    "tagline": "One sharp sentence that captures what it does and for whom",
    "problem": "A detailed explanation of the problem — what is broken, who feels it, why existing solutions fail them. Minimum three sentences.",
    "target_user": "A vivid description of the specific person this is built for. Their situation, their pain, their current workaround. Not a demographic. A real person type.",
    "product_goal": "One clear sentence: what this product enables the target user to do that they cannot do well today.",
    "mvp_features": [
      {
        "name": "Feature name",
        "description": "What this feature does and how the user interacts with it.",
        "why": "Why this feature is in the MVP — what it unlocks for the user, why it cannot be deferred."
      }
    ],
    "anti_scope": [
      {
        "item": "Feature or capability name",
        "reason": "Specific explanation of why this does not belong in v1 — resource cost, distraction from core value, premature complexity, or evidence it can come later without hurting users."
      }
    ],
    "roadmap": {
      "phase_1": {
        "title": "Validate",
        "duration": "Weeks 1–3",
        "actions": ["Specific action", "Specific action", "Specific action"]
      },
      "phase_2": {
        "title": "Build",
        "duration": "Weeks 4–8",
        "actions": ["Specific action", "Specific action", "Specific action"]
      },
      "phase_3": {
        "title": "Launch",
        "duration": "Weeks 9–12",
        "actions": ["Specific action", "Specific action", "Specific action"]
      }
    },
    "tech_stack": [
      {
        "recommended": "Technology or tool name",
        "reason": "Why this fits the product — speed, cost, scalability, team fit."
      }
    ],
    "risks": [
      {
        "risk": "Specific risk this product faces",
        "mitigation": "Concrete way to address or reduce this risk early."
      }
    ],
    "success_metrics": [
      "Metric 1 — specific and measurable",
      "Metric 2 — specific and measurable",
      "Metric 3 — specific and measurable"
    ],
    "next_move": "The single most important thing the user should do in the next 48 hours. Not 'start building'. A real, concrete action they can take today."
  }
}

## Response format rules

ALWAYS return valid JSON. One of two shapes:

If still in conversation:
{ "type": "message", "content": "your reply here" }

If ready to generate scope: the full scope JSON above.

No markdown outside the JSON. No preamble. No explanation. Just the JSON.`;

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const { conversation_id, message } = await request.json();
        if (!conversation_id || !message?.trim()) {
            return Response.json({ error: "conversation_id and message are required" }, { status: 400 });
        }

        const trimmed = message.trim();

        // Verify ownership
        const { data: conv } = await supabase
            .from("conversations")
            .select("id, title")
            .eq("id", conversation_id)
            .eq("user_id", user.id)
            .single();

        if (!conv) return Response.json({ error: "Conversation not found" }, { status: 404 });

        // Save user message
        await supabase.from("messages").insert({
            conversation_id,
            role: "user",
            content: trimmed,
        });

        // Set conversation title from first message
        if (!conv.title) {
            await supabase
                .from("conversations")
                .update({ title: trimmed.slice(0, 60) })
                .eq("id", conversation_id);
        }

        // Fetch full history
        const { data: history } = await supabase
            .from("messages")
            .select("role, content")
            .eq("conversation_id", conversation_id)
            .order("created_at", { ascending: true });

        const groqMessages = (history ?? []).map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
        }));

        const startTime = Date.now();

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...groqMessages,
            ],
            response_format: { type: "json_object" },
            temperature: 0.65,
            max_tokens: 4000,
        });

        const raw = completion.choices[0].message.content ?? "{}";
        let parsed: { type: "message" | "scope"; content?: string; data?: any };

        try {
            parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        } catch {
            return Response.json({ error: "Invalid AI response" }, { status: 500 });
        }

        const assistantContent =
            parsed.type === "message"
                ? (parsed.content ?? "")
                : JSON.stringify(parsed.data);

        // Save assistant message
        await supabase.from("messages").insert({
            conversation_id,
            role: "assistant",
            content: assistantContent,
        });

        // If scope — save to scopes table
        let scopeId: string | null = null;
        if (parsed.type === "scope" && parsed.data) {
            const { data: savedScope } = await supabase
                .from("scopes")
                .insert({
                    conversation_id,
                    user_id: user.id,
                    title: parsed.data.product_name ?? trimmed.slice(0, 60),
                    content: parsed.data,
                })
                .select("id")
                .single();

            scopeId = savedScope?.id ?? null;
        }

        return Response.json({
            type: parsed.type,
            content: parsed.type === "message" ? parsed.content : undefined,
            data: parsed.type === "scope" ? parsed.data : undefined,
            scope_id: scopeId,
            duration_ms: Date.now() - startTime,
        });
    } catch (err: any) {
        console.error("Chat error:", err);
        return Response.json({ error: err.message ?? "Something went wrong" }, { status: 500 });
    }
}
