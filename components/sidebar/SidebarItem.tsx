"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Pencil, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Conversation } from "@/lib/types";

interface Props {
    conversation: Conversation;
    onDelete: (id: string) => void;
    onRename: (id: string, title: string) => void;
    onNavigate?: () => void;
}

export default function SidebarItem({ conversation, onDelete, onRename, onNavigate }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [renameValue, setRenameValue] = useState(conversation.title ?? "");
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (renaming) {
            const el = inputRef.current;
            if (!el) return;
            el.focus();
            el.select();
        }
    }, [renaming]);

    function handleRenameSubmit() {
        if (renameValue.trim()) onRename(conversation.id, renameValue.trim());
        setRenaming(false);
    }

    return (
        <>
            <div className="group relative flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#0D1B2A]/5 transition-colors">
                {/* Title — always in the same slot, switches between button text and input */}
                <div className="flex-1 min-w-0">
                    {renaming ? (
                        <input
                            ref={inputRef}
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={handleRenameSubmit}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleRenameSubmit();
                                if (e.key === "Escape") setRenaming(false);
                            }}
                            className="w-full text-sm text-[#0D1B2A] bg-transparent outline-none leading-5"
                        />
                    ) : (
                        <button
                            onClick={() => { router.push(`/chat/${conversation.id}`); onNavigate?.(); }}
                            className="w-full text-left text-sm text-[#0D1B2A]/70 leading-5 block truncate"
                        >
                            {conversation.title || "…"}
                        </button>
                    )}
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[#0D1B2A]/40 hover:text-[#0D1B2A] transition-all"
                    >
                        <MoreHorizontal size={13} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full mt-1 z-[999] bg-white border border-[#0D1B2A]/10 rounded-xl shadow-lg py-1 w-44">
                            <button
                                onClick={() => { setRenaming(true); setMenuOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0D1B2A] hover:bg-[#0D1B2A]/5 transition-colors"
                            >
                                <Pencil size={13} className="text-[#0D1B2A]/40" />
                                Rename
                            </button>
                            <div className="border-t border-[#0D1B2A]/8 my-1" />
                            <button
                                onClick={() => { setShowDeleteModal(true); setMenuOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={13} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
                            onClick={() => setShowDeleteModal(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            key="modal"
                            initial={{ opacity: 0, scale: 0.95, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                            className="fixed inset-0 z-[1001] flex items-center justify-center pointer-events-none"
                        >
                            <div
                                className="relative bg-white rounded-2xl px-8 py-7 w-full max-w-sm pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg text-[#0D1B2A]/30 hover:text-[#0D1B2A]/60 hover:bg-[#0D1B2A]/6 transition-colors"
                                >
                                    <X size={15} />
                                </button>
                                <h2
                                    className="text-lg font-bold text-[#0D1B2A] mb-2"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Delete this chat?
                                </h2>
                                <p className="text-sm text-[#0D1B2A]/50 leading-relaxed mb-6">
                                    This will permanently delete <span className="font-semibold text-[#0D1B2A]/70">"{conversation.title}"</span> and all its messages. This cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 py-2.5 rounded-xl border border-[#0D1B2A]/12 text-sm font-semibold text-[#0D1B2A]/60 hover:bg-[#0D1B2A]/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => { onDelete(conversation.id); setShowDeleteModal(false); }}
                                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
