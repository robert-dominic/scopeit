"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import type { Conversation } from "@/lib/types";

interface Props {
    conversation: Conversation;
    onDelete: (id: string) => void;
    onRename: (id: string, title: string) => void;
}

export default function SidebarItem({ conversation, onDelete, onRename }: Props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
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
        if (renaming) inputRef.current?.focus();
    }, [renaming]);

    function handleRenameSubmit() {
        if (renameValue.trim()) onRename(conversation.id, renameValue.trim());
        setRenaming(false);
    }

    return (
        <div className="group relative flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors">
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
                    className="flex-1 text-xs bg-transparent border-b border-[var(--color-primary)] outline-none text-[var(--color-dark)]"
                />
            ) : (
                <button
                    onClick={() => router.push(`/chat?c=${conversation.id}`)}
                    className="flex-1 text-left text-xs text-[var(--color-dark)] truncate leading-5"
                >
                    {conversation.title ?? "Untitled chat"}
                </button>
            )}

            <div className="relative" ref={menuRef}>
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-[var(--color-muted)] hover:text-[var(--color-dark)] transition-all"
                >
                    <MoreHorizontal size={13} />
                </button>

                {menuOpen && (
                    <div className="absolute left-0 top-6 z-50 bg-white border border-[var(--color-border)] rounded-xl shadow-md py-1 w-40">
                        <button
                            onClick={() => { setRenaming(true); setMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--color-dark)] hover:bg-[var(--color-bg)] transition-colors"
                        >
                            <Pencil size={12} className="text-[var(--color-muted)]" />
                            Rename
                        </button>
                        <div className="border-t border-[var(--color-border)] my-1" />
                        <button
                            onClick={() => { onDelete(conversation.id); setMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <Trash2 size={12} />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
