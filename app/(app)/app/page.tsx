"use client";

import { useState } from "react";
import ChatMessages, { type Message } from "@/components/chat/ChatMessages";
import ChatInput from "@/components/chat/ChatInput";
import ScopePreviewCard from "@/components/scope/ScopePreviewCard";
import ScopePanel from "@/components/scope/ScopePanel";
import { ScopeJSON } from "@/lib/types";

const PROGRESS_MESSAGES = [
    "🔍 Reading your idea...",
    "🎯 Narrowing your target user...",
    "✂️ Cutting unnecessary features...",
    "🗺️ Building your roadmap...",
    "📊 Defining your success metric...",
];

export default function AppPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeScope, setActiveScope] = useState<ScopeJSON | null>(null);
    const [scopePanelOpen, setScopePanelOpen] = useState(false);

    function addMessage(msg: Omit<Message, "id">) {
        const id = crypto.randomUUID();
        setMessages((prev) => [...prev, { ...msg, id }]);
        return id;
    }

    async function handleSubmit(
        idea: string,
        industry: string,
        experience: string
    ) {
        if (isLoading) return;
        setIsLoading(true);
        setScopePanelOpen(false);

        addMessage({ role: "user", content: idea });

        // Stream progress messages
        for (let i = 0; i < PROGRESS_MESSAGES.length; i++) {
            await new Promise((r) => setTimeout(r, i === 0 ? 300 : 800));
            addMessage({
                role: "scout",
                content: PROGRESS_MESSAGES[i],
                isProgress: true,
            });
        }

        try {
            const res = await fetch("/api/generate-scope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idea, industry, experience }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error ?? "Generation failed");

            setActiveScope(data.scope);

            // Add preview card as a message
            addMessage({
                role: "scout",
                content: "__SCOPE_CARD__",
                scopeData: data.scope,
            });

        } catch (err: any) {
            addMessage({
                role: "scout",
                content: "Something went wrong. Try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Chat area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 space-y-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-2xl font-bold text-[#0D1B2A]">
                                What messy idea should Scout untangle?
                            </h1>
                            <p className="text-sm text-[#6B7280]">
                                Describe your product idea below — the messier, the better.
                            </p>
                        </div>
                        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                            {messages.map((msg) =>
                                msg.content === "__SCOPE_CARD__" && msg.scopeData ? (
                                    <ScopePreviewCard
                                        key={msg.id}
                                        scope={msg.scopeData}
                                        onView={() => setScopePanelOpen(true)}
                                    />
                                ) : (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        {msg.role === "scout" && (
                                            <div className="w-7 h-7 rounded-full bg-[#2EC4B6]/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                                                <span className="text-sm">🔍</span>
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-md rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                                ? "bg-[#0D1B2A] text-[#FFF8F0] rounded-br-sm"
                                                : msg.isProgress
                                                    ? "bg-transparent text-[#6B7280] italic"
                                                    : "bg-white border border-[#D4CFC7] text-[#0D1B2A] rounded-bl-sm"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <div className="px-4 pb-4">
                            <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
                        </div>
                    </>
                )}
            </div>

            {/* Right panel */}
            {scopePanelOpen && activeScope && (
                <ScopePanel
                    scope={activeScope}
                    onClose={() => setScopePanelOpen(false)}
                />
            )}
        </div>
    );
}