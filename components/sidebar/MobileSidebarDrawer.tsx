"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, LogOut, MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import type { Conversation } from "@/lib/types";
import SidebarItem from "./SidebarItem";

interface Props {
    user: User;
    conversations: Conversation[];
    open: boolean;
    onClose: () => void;
}

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function MobileSidebarDrawer({ user, conversations: initial, open, onClose }: Props) {
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

    // Close on route change
    useEffect(() => {
        if (open) {
            const handler = () => onClose();
            window.addEventListener("sidebar-refresh", handler);
            return () => window.removeEventListener("sidebar-refresh", handler);
        }
    }, [open, onClose]);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/");
    }

    async function handleDelete(id: string) {
        await supabase.from("conversations").delete().eq("id", id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        window.dispatchEvent(new CustomEvent("conversation-deleted", { detail: { id } }));
        onClose();
    }

    async function handleRename(id: string, title: string) {
        await supabase.from("conversations").update({ title }).eq("id", id);
        setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    }

    function handleNewChat() {
        router.push("/chat/new");
        onClose();
    }

    const titled = conversations.filter((c) => !!c.title);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        key="drawer"
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.28, ease }}
                        className="fixed inset-y-0 left-0 z-50 w-72 bg-[#FFF8F0] flex flex-col shadow-2xl md:hidden"
                    >
                        {/* Header */}
                        <div className="px-4 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
                            <span className="text-base font-extrabold text-[#0D1B2A]" style={{ fontFamily: "var(--font-heading)" }}>
                                Scope<span className="text-[#2EC4B6]">It</span>
                            </span>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-[#0D1B2A]/30 hover:text-[#0D1B2A]/60 hover:bg-[#0D1B2A]/6 transition-colors"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        {/* New chat */}
                        <div className="px-3 pb-3 flex-shrink-0">
                            <button
                                onClick={handleNewChat}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#0D1B2A]/60 hover:text-[#0D1B2A] hover:bg-[#0D1B2A]/6 transition-colors"
                            >
                                <Plus size={16} className="flex-shrink-0" />
                                <span className="text-sm font-medium">New chat</span>
                            </button>
                        </div>

                        {/* Conversation list */}
                        <div className="flex-1 overflow-y-auto px-3 pb-3">
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
                                    {titled.map((c) => (
                                        <SidebarItem
                                            key={c.id}
                                            conversation={c}
                                            onDelete={handleDelete}
                                            onRename={handleRename}
                                            onNavigate={onClose}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-3 border-t border-[#0D1B2A]/8 flex items-center justify-between flex-shrink-0 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-[#2EC4B6] flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm font-bold text-white">
                                        {(user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || user.email?.split("@")[0] || "?")[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-[#0D1B2A]/80 truncate leading-tight">
                                        {user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.display_name || user.email?.split("@")[0]}
                                    </span>
                                    <span className="text-xs text-[#0D1B2A]/40 truncate leading-tight">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOut}
                                title="Sign out"
                                className="p-1.5 rounded-lg text-[#0D1B2A]/25 hover:text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                            >
                                <LogOut size={13} />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
