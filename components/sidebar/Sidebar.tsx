"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
    Plus,
    PanelLeftClose,
    PanelLeftOpen,
    Star,
    LogOut,
    MoreHorizontal,
    Trash2,
    Pencil,
    StarOff,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import SidebarItem from "./SidebarItem";

type Project = {
    id: string;
    title: string | null;
    is_favorite: boolean;
    created_at: string;
};

interface SidebarProps {
    user: User;
    projects: Project[];
}

export default function Sidebar({ user, projects: initialProjects }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [projects, setProjects] = useState(initialProjects);
    const router = useRouter();
    const supabase = createClient();

    const favorites = projects.filter((p) => p.is_favorite);
    const recent = projects.filter((p) => !p.is_favorite);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    }

    async function handleDelete(id: string) {
        await supabase.from("projects").delete().eq("id", id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
    }

    async function handleRename(id: string, title: string) {
        await supabase.from("projects").update({ title }).eq("id", id);
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, title } : p))
        );
    }

    async function handleToggleFavorite(id: string, current: boolean) {
        await supabase
            .from("projects")
            .update({ is_favorite: !current })
            .eq("id", id);
        setProjects((prev) =>
            prev.map((p) => (p.id === id ? { ...p, is_favorite: !current } : p))
        );
    }

    if (collapsed) {
        return (
            <aside className="w-12 flex-shrink-0 border-r border-[#D4CFC7] bg-white flex flex-col items-center py-4 gap-4">
                <button
                    onClick={() => setCollapsed(false)}
                    className="text-[#6B7280] hover:text-[#0D1B2A] transition-colors"
                >
                    <PanelLeftOpen size={18} />
                </button>
                <button
                    onClick={() => router.push("/app")}
                    className="text-[#6B7280] hover:text-[#2EC4B6] transition-colors"
                >
                    <Plus size={18} />
                </button>
            </aside>
        );
    }

    return (
        <aside className="w-60 flex-shrink-0 border-r border-[#D4CFC7] bg-white flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-[#D4CFC7] flex items-center justify-between">
                <span className="text-sm font-bold">
                    Scope<span className="text-[#2EC4B6]">It</span>
                </span>
                <button
                    onClick={() => setCollapsed(true)}
                    className="text-[#6B7280] hover:text-[#0D1B2A] transition-colors"
                >
                    <PanelLeftClose size={16} />
                </button>
            </div>

            {/* New scope button */}
            <div className="p-3">
                <button
                    onClick={() => router.push("/app")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#0D1B2A] hover:bg-[#F5F0E8] transition-colors"
                >
                    <Plus size={16} className="text-[#2EC4B6]" />
                    New Scope
                </button>
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
                {/* Favorites */}
                {favorites.length > 0 && (
                    <div>
                        <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                            <Star size={11} className="text-[#6B7280]" />
                            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                                Favorites
                            </span>
                        </div>
                        {favorites.map((p) => (
                            <SidebarItem
                                key={p.id}
                                project={p}
                                onDelete={handleDelete}
                                onRename={handleRename}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                )}

                {/* Recent */}
                {recent.length > 0 && (
                    <div>
                        <div className="flex items-center gap-1.5 px-2 py-1 mb-1">
                            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                                Recent
                            </span>
                        </div>
                        {recent.map((p) => (
                            <SidebarItem
                                key={p.id}
                                project={p}
                                onDelete={handleDelete}
                                onRename={handleRename}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                )}

                {projects.length === 0 && (
                    <p className="text-xs text-[#6B7280] px-2 py-1">
                        No scopes yet. Create your first one.
                    </p>
                )}
            </div>

            {/* Footer — user + sign out */}
            <div className="p-3 border-t border-[#D4CFC7]">
                <div className="flex items-center justify-between px-2 py-2">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#0D1B2A] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[#FFF8F0]">
                                {user.email?.[0].toUpperCase()}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-[#0D1B2A] truncate">
                            {user.email?.split("@")[0]}
                        </span>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="text-[#6B7280] hover:text-[#FF6B6B] transition-colors flex-shrink-0 p-1.5 rounded-lg hover:bg-[#FF6B6B]/8"
                        title="Sign out"
                    >
                        <LogOut size={15} />
                    </button>
                </div>
            </div>
        </aside>
    );
}