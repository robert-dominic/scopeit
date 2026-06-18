"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, PanelLeftClose, PanelLeftOpen, LogOut, MessageSquare } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Conversation } from "@/lib/types";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
    user: User;
    conversations: Conversation[];
}

export default function Sidebar({ user, conversations: initial }: SidebarProps) {
    const [conversations, setConversations] = useState(initial);
    const [collapsed, setCollapsed] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleNewChat() {
        const res = await fetch("/api/conversations", { method: "POST" });
        if (!res.ok) return;
        const conv = await res.json();
        setConversations((prev) => [conv, ...prev]);
        router.push(`/chat?c=${conv.id}`);
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/login");
    }

    async function handleDelete(id: string) {
        await supabase.from("conversations").delete().eq("id", id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
    }

    async function handleRename(id: string, title: string) {
        await supabase.from("conversations").update({ title }).eq("id", id);
        setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, title } : c))
        );
    }

    if (collapsed) {
        return (
            <aside className="w-12 flex-shrink-0 border-r border-[var(--color-border)] bg-white flex flex-col items-center py-3 gap-3">
                <button
                    onClick={() => setCollapsed(false)}
                    className="p-2 text-[var(--color-muted)] hover:text-[var(--color-dark)] transition-colors"
                >
                    <PanelLeftOpen size={17} />
                </button>
                <button
                    onClick={handleNewChat}
                    className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <Plus size={17} />
                </button>
            </aside>
        );
    }

    return (
        <aside className="w-56 flex-shrink-0 border-r border-[var(--color-border)] bg-white flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-dark)]">
                    Scope<span className="text-[var(--color-primary)]">It</span>
                </span>
                <button
                    onClick={() => setCollapsed(true)}
                    className="text-[var(--color-muted)] hover:text-[var(--color-dark)] transition-colors"
                >
                    <PanelLeftClose size={16} />
                </button>
            </div>

            {/* New chat */}
            <div className="p-2">
                <button
                    onClick={handleNewChat}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-dark)] hover:bg-[var(--color-primary-subtle)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <Plus size={15} />
                    New Chat
                </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-2 pb-2">
                {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-3">
                        <MessageSquare size={18} className="text-[var(--color-border)]" />
                        <p className="text-xs text-[var(--color-muted)]">
                            No chats yet. Start your first one.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-0.5 pt-1">
                        {conversations.map((c) => (
                            <SidebarItem
                                key={c.id}
                                conversation={c}
                                onDelete={handleDelete}
                                onRename={handleRename}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-[var(--color-border)]">
                <div className="flex items-center justify-between px-2 py-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[var(--color-primary)]">
                                {user.email?.[0].toUpperCase()}
                            </span>
                        </div>
                        <span className="text-xs font-medium text-[var(--color-dark)] truncate">
                            {user.email?.split("@")[0]}
                        </span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        title="Sign out"
                        className="text-[var(--color-muted)] hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
