"use client";

import { useState, useEffect, useRef, useCallback, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import ChatInput from "@/components/chat/ChatInput";
import MessageList from "@/components/chat/MessageList";
import ScopePanel from "@/components/chat/ScopePanel";
import MobileScopeSheet from "@/components/chat/MobileScopeSheet";
import type { ChatMessage, ScopeDocument } from "@/lib/types";

const MIN_PANEL_WIDTH = 520;
const MAX_PANEL_WIDTH = 680;
const DEFAULT_PANEL_WIDTH = 520;

export default function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("");
    const [activeScope, setActiveScope] = useState<ScopeDocument | null>(null);
    const [activeScopeId, setActiveScopeId] = useState<string | null>(null);
    const [scopePanelOpen, setScopePanelOpen] = useState(false);
    const [title, setTitle] = useState<string>("");
    const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
    const isPanelResizing = useRef(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const firstMessageSent = useRef(false);
    const loadingTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

    const startPanelResize = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        isPanelResizing.current = true;

        function onMouseMove(ev: MouseEvent) {
            if (!isPanelResizing.current) return;
            const newWidth = window.innerWidth - ev.clientX;
            setPanelWidth(Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, newWidth)));
        }

        function onMouseUp() {
            isPanelResizing.current = false;
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        function onDeleted(e: Event) {
            const deletedId = (e as CustomEvent<{ id: string }>).detail.id;
            if (deletedId === id) router.push("/chat/new");
        }
        window.addEventListener("conversation-deleted", onDeleted);
        return () => window.removeEventListener("conversation-deleted", onDeleted);
    }, [id, router]);

    useEffect(() => {
        const first = searchParams.get("first");
        if (first && !firstMessageSent.current) {
            firstMessageSent.current = true;
            window.history.replaceState(null, "", `/chat/${id}`);
            sendMessage(first);
        } else if (!first) {
            setMessages([]);
            setActiveScope(null);
            setScopePanelOpen(false);
            setTitle("");
            loadConversation(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function loadConversation(convId: string) {
        const supabase = createClient();

        const { data: conv } = await supabase
            .from("conversations")
            .select("title")
            .eq("id", convId)
            .maybeSingle();
        if (conv?.title) setTitle(conv.title);

        const { data: msgs } = await supabase
            .from("messages")
            .select("id, role, content")
            .eq("conversation_id", convId)
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
            .eq("conversation_id", convId)
            .maybeSingle();

        if (scope) {
            setActiveScope(scope.content);
            setActiveScopeId(scope.id);
            setScopePanelOpen(true);
        }
    }

    function addMessage(msg: Omit<ChatMessage, "id">) {
        setMessages((prev) => [...prev, { ...msg, id: crypto.randomUUID() }]);
    }

    async function sendMessage(message: string) {
        if (isLoading) return;
        setIsLoading(true);
        addMessage({ role: "user", content: message });

        const statusSequence: [number, string][] = [
            [0, "ScopeIt is thinking…"],
            [3000, "Clarifying your idea…"],
            [7000, "Mapping the problem…"],
            [12000, "Building your roadmap…"],
            [18000, "Almost there…"],
        ];
        loadingTimeouts.current = statusSequence.map(([delay, msg]) =>
            setTimeout(() => setLoadingStatus(msg), delay)
        );

        const isFirstMessage = !title;

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ conversation_id: id, message }),
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

            if (isFirstMessage) {
                const supabase = createClient();
                const { data: conv } = await supabase
                    .from("conversations")
                    .select("title")
                    .eq("id", id)
                    .maybeSingle();
                if (conv?.title) setTitle(conv.title);
            }

            window.dispatchEvent(new CustomEvent("conversationUpdated"));
            window.dispatchEvent(new CustomEvent("sidebar-refresh"));
        } catch {
            addMessage({ role: "assistant", content: "Something went wrong. Please try again." });
        } finally {
            loadingTimeouts.current.forEach(clearTimeout);
            loadingTimeouts.current = [];
            setLoadingStatus("");
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-1 overflow-hidden bg-[#FFF8F0]">
            {/* Chat column */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Top bar — desktop only (mobile top bar is in SidebarShell) */}
                <div className="hidden md:flex flex-shrink-0 chat-header border-b border-[#0D1B2A]/8 bg-[#FFF8F0] items-center justify-between">
                    <p className="text-sm font-semibold text-[#0D1B2A]/60 truncate">{title || ""}</p>
                    {activeScope && !scopePanelOpen && (
                        <button
                            onClick={() => setScopePanelOpen(true)}
                            title="View scope document"
                            className="p-1.5 rounded-lg text-[#0D1B2A]/40 hover:text-[#0D1B2A]/70 hover:bg-[#0D1B2A]/6 transition-colors flex-shrink-0"
                        >
                            <FileText size={16} />
                        </button>
                    )}
                </div>

                {/* Mobile chat title + scope toggle */}
                <div className="md:hidden flex-shrink-0 flex items-center justify-between px-4 py-2 bg-[#FFF8F0]">
                    <p className="text-sm font-semibold text-[#0D1B2A]/60 truncate flex-1">{title || ""}</p>
                    {activeScope && (
                        <button
                            onClick={() => setScopePanelOpen(true)}
                            className="p-1.5 rounded-lg text-[#0D1B2A]/40 hover:text-[#0D1B2A]/70 hover:bg-[#0D1B2A]/6 transition-colors flex-shrink-0"
                        >
                            <FileText size={16} />
                        </button>
                    )}
                </div>

                {/* Messages */}
                <MessageList
                    messages={messages}
                    isLoading={isLoading}
                    loadingStatus={loadingStatus}
                    onViewScope={() => setScopePanelOpen(true)}
                    bottomRef={bottomRef}
                />

                {/* Input — hidden once scope is generated */}
                {!activeScope && (
                    <div className="flex-shrink-0 px-3 md:px-4 pt-2 bg-[#FFF8F0]" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom) + 0.75rem)" }}>
                        <div className="max-w-3xl mx-auto">
                            <ChatInput onSubmit={sendMessage} isLoading={isLoading} />
                        </div>
                    </div>
                )}
            </div>

            {/* Desktop scope panel — side by side */}
            <AnimatePresence>
                {scopePanelOpen && activeScope && (
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="hidden md:flex flex-shrink-0"
                        style={{ width: panelWidth, minWidth: MIN_PANEL_WIDTH, maxWidth: MAX_PANEL_WIDTH }}
                    >
                        <ScopePanel
                            scope={activeScope}
                            scopeId={activeScopeId}
                            onClose={() => setScopePanelOpen(false)}
                            onResizeStart={startPanelResize}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile scope sheet — full screen bottom sheet */}
            <MobileScopeSheet
                scope={activeScope}
                scopeId={activeScopeId}
                open={scopePanelOpen && !!activeScope}
                onClose={() => setScopePanelOpen(false)}
            />
        </div>
    );
}
