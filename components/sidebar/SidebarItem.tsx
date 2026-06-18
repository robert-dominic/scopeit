"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Trash2, Pencil, Star, StarOff } from "lucide-react";

type Project = {
    id: string;
    title: string | null;
    is_favorite: boolean;
    created_at: string;
};

interface SidebarItemProps {
    project: Project;
    onDelete: (id: string) => void;
    onRename: (id: string, title: string) => void;
    onToggleFavorite: (id: string, current: boolean) => void;
}

export default function SidebarItem({
    project,
    onDelete,
    onRename,
    onToggleFavorite,
}: SidebarItemProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState(project.title ?? "");
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
        if (renameValue.trim()) {
            onRename(project.id, renameValue.trim());
        }
        setRenaming(false);
    }

    return (
        <div className="group relative flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F5F0E8] transition-colors">
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
                    className="flex-1 text-sm bg-transparent border-b border-[#2EC4B6] outline-none text-[#0D1B2A]"
                />
            ) : (
                <button
                    onClick={() => router.push(`/app?scope=${project.id}`)}
                    className="flex-1 text-left text-sm text-[#0D1B2A] truncate"
                >
                    {project.title ?? "Untitled scope"}
                </button>
            )}

            {/* Three dot menu */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((prev) => !prev);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[#6B7280] hover:text-[#0D1B2A] transition-all p-0.5 rounded"
                >
                    <MoreHorizontal size={14} />
                </button>

                {menuOpen && (
                    <div className="absolute left-0 top-6 z-50 bg-white border border-[#D4CFC7] rounded-xl shadow-lg py-1 w-44">
                        <button
                            onClick={() => {
                                onToggleFavorite(project.id, project.is_favorite);
                                setMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0D1B2A] hover:bg-[#F5F0E8] transition-colors"
                        >
                            {project.is_favorite ? (
                                <>
                                    <StarOff size={14} className="text-[#6B7280]" />
                                    Remove favorite
                                </>
                            ) : (
                                <>
                                    <Star size={14} className="text-[#FFB703]" />
                                    Add to favorites
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setRenaming(true);
                                setMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0D1B2A] hover:bg-[#F5F0E8] transition-colors"
                        >
                            <Pencil size={14} className="text-[#6B7280]" />
                            Rename
                        </button>
                        <div className="border-t border-[#D4CFC7] my-1" />
                        <button
                            onClick={() => {
                                onDelete(project.id);
                                setMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/5 transition-colors"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}