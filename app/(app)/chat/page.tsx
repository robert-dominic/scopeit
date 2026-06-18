"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { X, Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ChatInput from "@/components/chat/ChatInput";
import type { ChatMessage, ScopeDocument } from "@/lib/types";

const STARTERS = [
    "I want to build a budgeting app for college students",
    "An AI tool that helps freelancers write proposals",
    "A platform for local tutors to find students",
    "A habit tracker that actually keeps you accountable",
];

function ChatPageInner() {
    const searchParams = useSearchParams();
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeScope, setActiveScope] = useState<ScopeDocument | null>(null);
    const [scopePanelOpen, setScopePanelOpen] = useState(false);
    const [activeScopeId, setActiveScopeId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        const cId = searchParams.get("c");
        if (cId) {
            loadConversation(cId);
        } else {
            createConversation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function createConversation() {
        const res = await fetch("/api/conversations", { method: "POST" });
        if (!res.ok) return;
        const data = await res.json();
        setConversationId(data.id);
        window.history.replaceState(null, "", `/chat?c=${data.id}`);
    }

    async function loadConversation(id: string) {
        setConversationId(id);
        const supabase = createClient();

        const { data: msgs } = await supabase
            .from("messages")
            .select("id, role, content")
            .eq("conversation_id", id)
            .order("created_at", { ascending: true });

        const uiMessages: ChatMessage[] = (msgs ?? []).map((m) => {
            if (m.role === "assistant") {
                try {
                    const parsed = JSON.parse(m.content);
                    if (parsed?.product_name) {
                        return { id: m.id, role: "assistant" as const, content: "__SCOPE__", scopeData: parsed };
                    }
                } catch { }
            }
            return { id: m.id, role: m.role as "user" | "assistant", content: m.content };
        });

        setMessages(uiMessages);

        const { data: scope } = await supabase
            .from("scopes")
            .select("id, content")
            .eq("conversation_id", id)
            .maybeSingle();

        if (scope) {
            setActiveScope(scope.content);
            setActiveScopeId(scope.id);
            setScopePanelOpen(true);
        }
    }

    function addMessage(msg: Omit<ChatMessage, "id">) {
        const id = crypto.randomUUID();
        setMessages((prev) => [...prev, { ...msg, id }]);
    }

    async function handleSubmit(message: string) {
        if (isLoading || !conversationId) return;
        setIsLoading(true);
        addMessage({ role: "user", content: message });

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation_id: conversationId, message }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Something went wrong");

            if (data.type === "message") {
                addMessage({ role: "assistant", content: data.content });
            } else if (data.type === "scope") {
                setActiveScope(data.data);
                setActiveScopeId(data.scope_id ?? null);
                addMessage({ role: "assistant", content: "__SCOPE__", scopeData: data.data });
                setScopePanelOpen(true);
            }
        } catch {
            addMessage({ role: "assistant", content: "Something went wrong. Please try again." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Chat area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {messages.length === 0 ? (
                    /* Empty state */
                    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 gap-8">
                        <div className="text-center space-y-2 max-w-sm">
                            <h2 className="text-xl font-bold text-[var(--color-dark)]">
                                What are you building?
                            </h2>
                            <p className="text-sm text-[var(--color-muted)]">
                                Share your idea — even the messy half-formed ones.
                            </p>
                        </div>

                        {/* Starter prompts */}
                        <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
                            {STARTERS.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => handleSubmit(s)}
                                    className="text-left text-xs text-[var(--color-muted)] bg-white border border-[var(--color-border)] rounded-xl px-3 py-2.5 hover:border-[var(--color-primary)] hover:text-[var(--color-dark)] transition-all leading-relaxed"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        <div className="w-full max-w-lg">
                            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
                        </div>
                    </div>
                ) : (
                    /* Active conversation */
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                            {messages.map((msg) => {
                                if (msg.content === "__SCOPE__" && msg.scopeData) {
                                    return (
                                        <ScopePreviewCard
                                            key={msg.id}
                                            scope={msg.scopeData}
                                            onView={() => setScopePanelOpen(true)}
                                        />
                                    );
                                }
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "assistant" && (
                                            <div className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                                                <span className="text-xs font-bold text-[var(--color-primary)]">S</span>
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-sm text-sm leading-relaxed rounded-2xl px-4 py-2.5 ${
                                                msg.role === "user"
                                                    ? "bg-[var(--color-dark)] text-white rounded-br-sm"
                                                    : "bg-white border border-[var(--color-border)] text-[var(--color-dark)] rounded-bl-sm"
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Typing indicator */}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                                        <span className="text-xs font-bold text-[var(--color-primary)]">S</span>
                                    </div>
                                    <div className="bg-white border border-[var(--color-border)] rounded-2xl rounded-bl-sm px-4 py-3">
                                        <span className="flex gap-1 items-center">
                                            <span className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-bounce [animation-delay:0ms]" />
                                            <span className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-bounce [animation-delay:150ms]" />
                                            <span className="w-1.5 h-1.5 bg-[var(--color-muted)] rounded-full animate-bounce [animation-delay:300ms]" />
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        <div className="px-4 pb-4">
                            <div className="max-w-2xl mx-auto">
                                <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Scope panel */}
            {scopePanelOpen && activeScope && (
                <ScopePanel
                    scope={activeScope}
                    scopeId={activeScopeId}
                    onClose={() => setScopePanelOpen(false)}
                />
            )}
        </div>
    );
}

/* ── Scope preview card (inline, appears in chat) ── */
function ScopePreviewCard({ scope, onView }: { scope: ScopeDocument; onView: () => void }) {
    return (
        <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <span className="text-xs font-bold text-[var(--color-primary)]">S</span>
            </div>
            <button
                onClick={onView}
                className="text-left bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-2xl rounded-bl-sm px-4 py-3.5 max-w-sm transition-all group"
            >
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                        Scope Ready
                    </span>
                </div>
                <p className="text-sm font-semibold text-[var(--color-dark)]">{scope.product_name}</p>
                <p className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-2">{scope.tagline}</p>
                <p className="text-xs text-[var(--color-primary)] mt-2 font-medium group-hover:underline">
                    View full scope →
                </p>
            </button>
        </div>
    );
}

/* ── Scope panel (right side) ── */
function ScopePanel({ scope, onClose }: { scope: ScopeDocument; scopeId?: string | null; onClose: () => void }) {

    async function handleExport() {
        const { pdf } = await import("@react-pdf/renderer");
        const { ScopePDFDocument } = await import("@/components/scope/ScopePDF");
        const blob = await pdf(<ScopePDFDocument scope={scope} />).toBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${scope.product_name.toLowerCase().replace(/\s+/g, "-")}-scope.pdf`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <aside className="w-[440px] flex-shrink-0 border-l border-[var(--color-border)] bg-white flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)] flex-shrink-0">
                <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider">
                    Scope Document
                </span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-dark)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                        <Download size={12} />
                        Export PDF
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-dark)] hover:bg-[var(--color-bg)] transition-colors"
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
                <ScopeDocumentView scope={scope} />
            </div>
        </aside>
    );
}

/* ── Full scope document renderer ── */
function ScopeDocumentView({ scope }: { scope: ScopeDocument }) {
    return (
        <div className="space-y-7 pb-8">
            {/* Header */}
            <div className="space-y-1.5">
                <h1 className="text-2xl font-bold text-[var(--color-dark)] leading-tight">
                    {scope.product_name}
                </h1>
                <p className="text-sm text-[var(--color-primary)] font-medium">{scope.tagline}</p>
            </div>

            <Section label="The Problem">
                <p className="text-sm text-[var(--color-dark)] leading-relaxed">{scope.problem}</p>
            </Section>

            <Section label="Target User">
                <p className="text-sm text-[var(--color-dark)] leading-relaxed">{scope.target_user}</p>
            </Section>

            <Section label="Product Goal">
                <p className="text-sm font-semibold text-[var(--color-dark)] leading-relaxed">{scope.product_goal}</p>
            </Section>

            {/* MVP Features */}
            <div className="space-y-2">
                <span className="section-label">What to Build</span>
                <div className="scope-build-bg border border-[var(--color-primary)]/20 rounded-xl p-4 space-y-4">
                    {scope.mvp_features.map((f, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-[var(--color-primary)]">{i + 1}.</span>
                                <span className="text-sm font-semibold text-[var(--color-dark)]">{f.name}</span>
                            </div>
                            <p className="text-xs text-[var(--color-dark)] leading-relaxed pl-4">{f.description}</p>
                            <p className="text-xs text-[var(--color-muted)] leading-relaxed pl-4 italic">Why now: {f.why}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Anti-scope */}
            <div className="space-y-2">
                <span className="section-label">What NOT to Build</span>
                <div className="scope-stop-bg border border-red-200 rounded-xl p-4 space-y-3">
                    {scope.anti_scope.map((a, i) => (
                        <div key={i}>
                            <div className="flex items-start gap-2">
                                <span className="text-red-400 font-bold text-xs mt-0.5 flex-shrink-0">✕</span>
                                <div>
                                    <span className="text-sm font-semibold text-[var(--color-dark)]">{a.item}</span>
                                    <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">{a.reason}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Roadmap */}
            <div className="space-y-2">
                <span className="section-label">Roadmap</span>
                <div className="grid grid-cols-3 gap-2">
                    {[scope.roadmap.phase_1, scope.roadmap.phase_2, scope.roadmap.phase_3].map((phase, i) => (
                        <div key={i} className="bg-white border border-[var(--color-border)] rounded-xl p-3 space-y-2">
                            <div>
                                <span className="text-xs font-bold text-[var(--color-primary)]">Phase {i + 1}</span>
                                <p className="text-xs font-semibold text-[var(--color-dark)] mt-0.5">{phase.title}</p>
                                <p className="text-xs text-[var(--color-muted)]">{phase.duration}</p>
                            </div>
                            <ul className="space-y-1">
                                {phase.actions.map((a, j) => (
                                    <li key={j} className="text-xs text-[var(--color-dark)] flex items-start gap-1 leading-relaxed">
                                        <span className="mt-1 flex-shrink-0 w-1 h-1 rounded-full bg-[var(--color-primary)] block" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech stack */}
            {scope.tech_stack?.length > 0 && (
                <div className="space-y-2">
                    <span className="section-label">Recommended Stack</span>
                    <div className="space-y-2">
                        {scope.tech_stack.map((t, i) => (
                            <div key={i} className="bg-white border border-[var(--color-border)] rounded-xl px-4 py-3">
                                <span className="text-sm font-semibold text-[var(--color-dark)]">{t.recommended}</span>
                                <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">{t.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Risks */}
            {scope.risks?.length > 0 && (
                <Section label="Risks & Mitigations">
                    <div className="space-y-3">
                        {scope.risks.map((r, i) => (
                            <div key={i}>
                                <p className="text-sm font-semibold text-[var(--color-dark)]">{r.risk}</p>
                                <p className="text-xs text-[var(--color-muted)] mt-0.5 leading-relaxed">→ {r.mitigation}</p>
                            </div>
                        ))}
                    </div>
                </Section>
            )}

            {/* Success metrics */}
            <Section label="Success Metrics">
                <ul className="space-y-1.5">
                    {scope.success_metrics.map((m, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-[var(--color-dark)]">
                            <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] block" />
                            {m}
                        </li>
                    ))}
                </ul>
            </Section>

            {/* Next move */}
            <div className="space-y-2">
                <span className="section-label">Your Next Move</span>
                <div className="bg-[var(--color-dark)] rounded-xl p-4">
                    <p className="text-sm font-medium text-white leading-relaxed">{scope.next_move}</p>
                </div>
            </div>
        </div>
    );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <span className="section-label">{label}</span>
            <div className="bg-white border border-[var(--color-border)] rounded-xl p-4">
                {children}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={null}>
            <ChatPageInner />
        </Suspense>
    );
}
