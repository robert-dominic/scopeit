"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, LogOut, MessageSquare, PanelLeftOpen, PanelLeftClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import type { Conversation } from "@/lib/types";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
    user: User;
    conversations: Conversation[];
    collapsed: boolean;
    onCollapse: () => void;
    onExpand: () => void;
}

const SIDEBAR_WIDTH = 260;
const RAIL_WIDTH = 52;
const ease = [0.25, 0.1, 0.25, 1] as const;

export default function Sidebar({ user, conversations: initial, collapsed, onCollapse, onExpand }: SidebarProps) {
    const [conversations, setConversations] = useState(initial);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => { setConversations(initial); }, [initial]);

    useEffect(() => {
        async function refresh() {
            const { data } = await supabase
                .from("conversations")
                .select("id, title, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (data) setConversations(data);
        }
        window.addEventListener("conversationUpdated", refresh);
        window.addEventListener("sidebar-refresh", refresh);
        return () => {
            window.removeEventListener("conversationUpdated", refresh);
            window.removeEventListener("sidebar-refresh", refresh);
        };
    }, [user.id, supabase]);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/");
    }

    async function handleDelete(id: string) {
        await supabase.from("conversations").delete().eq("id", id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        window.dispatchEvent(new CustomEvent("conversation-deleted", { detail: { id } }));
    }

    async function handleRename(id: string, title: string) {
        await supabase.from("conversations").update({ title }).eq("id", id);
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    }

    const titled = conversations.filter((c) => !!c.title);
    const targetWidth = collapsed ? RAIL_WIDTH : SIDEBAR_WIDTH;

    return (
        <motion.aside
            animate={{ width: targetWidth, minWidth: targetWidth }}
            transition={{ duration: 0.3, ease }}
            className="flex-shrink-0 border-r border-[#0D1B2A]/8 bg-[#FFF8F0] flex flex-col overflow-hidden h-full"
        >
            {/* Header */}
            <div className="px-3 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
                <AnimatePresence initial={false}>
                    {!collapsed && (
                        <motion.span
                            key="logo"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-base font-extrabold text-[#0D1B2A] whitespace-nowrap overflow-hidden"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            Scope<span className="text-[#2EC4B6]">It</span>
                        </motion.span>
                    )}
                </AnimatePresence>
                <button
                    onClick={collapsed ? onExpand : onCollapse}
                    title={collapsed ? "Open sidebar" : "Close sidebar"}
                    className="p-1.5 rounded-lg text-[#0D1B2A]/30 hover:text-[#0D1B2A]/60 hover:bg-[#0D1B2A]/6 transition-colors flex-shrink-0"
                >
                    {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
                </button>
            </div>

            {/* New chat button */}
            <div className="px-2 pb-3 flex-shrink-0">
                <button
                    onClick={() => router.push("/chat/new")}
                    title="New chat"
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[#0D1B2A]/50 hover:text-[#0D1B2A] hover:bg-[#0D1B2A]/6 transition-colors ${collapsed ? "justify-center" : ""}`}
                >
                    <Plus size={16} className="flex-shrink-0" />
                    <AnimatePresence initial={false}>
                        {!collapsed && (
                            <motion.span
                                key="new-chat-text"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2, ease }}
                                className="text-sm font-medium overflow-hidden whitespace-nowrap"
                            >
                                New chat
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Conversation list — only when expanded */}
            <AnimatePresence initial={false}>
                {!collapsed && (
                    <motion.div
                        key="conv-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease }}
                        className="flex-1 overflow-y-auto px-2 pb-3"
                    >
                        {titled.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center px-4">
                                <MessageSquare size={18} className="text-[#0D1B2A]/15" />
                                <p className="text-xs text-[#0D1B2A]/30 leading-relaxed">
                                    No chats yet.<br />Start your first one.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-[#0D1B2A]/25 uppercase tracking-widest px-2 pb-1 pt-1">
                                    Recents
                                </p>
                                <AnimatePresence initial={false}>
                                    {titled.map((c) => (
                                        <motion.div
                                            key={c.id}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -6 }}
                                            transition={{ duration: 0.18 }}
                                        >
                                            <SidebarItem
                                                conversation={c}
                                                onDelete={handleDelete}
                                                onRename={handleRename}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer when collapsed */}
            {collapsed && <div className="flex-1" />}

            {/* Footer */}
            <div className="px-2 py-3 border-t border-[#0D1B2A]/8 flex items-center justify-between flex-shrink-0 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-[#2EC4B6] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                            {(user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || user.email?.split("@")[0] || "?")[0].toUpperCase()}
                        </span>
                    </div>
                    <AnimatePresence initial={false}>
                        {!collapsed && (
                            <motion.div
                                key="user-info"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2, ease }}
                                className="flex flex-col min-w-0 overflow-hidden"
                            >
                                <span className="text-sm font-semibold text-[#0D1B2A]/80 truncate whitespace-nowrap leading-tight">
                                    {user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || user.email?.split("@")[0]}
                                </span>
                                <span className="text-xs text-[#0D1B2A]/40 truncate whitespace-nowrap leading-tight">
                                    {user.email}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    onClick={handleSignOut}
                    title="Sign out"
                    className="p-1.5 rounded-lg text-[#0D1B2A]/25 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                    <LogOut size={13} />
                </button>
            </div>
        </motion.aside>
    );
}
