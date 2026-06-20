"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import OnboardingTour, { useShouldShowTour } from "@/components/OnboardingTour";
import type { User } from "@supabase/supabase-js";
import type { Conversation } from "@/lib/types";

interface Props {
    user: User;
    conversations: Conversation[];
    children: React.ReactNode;
}

export default function SidebarShell({ user, conversations, children }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { show: showTour, dismiss: dismissTour } = useShouldShowTour();

    const hasDisplayName = !!(
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.display_name
    );

    return (
        <div className="flex overflow-hidden bg-[#FFF8F0]" style={{ height: "100dvh" }}>
            {/* Desktop sidebar — hidden on mobile */}
            <div className="hidden md:flex flex-shrink-0">
                <Sidebar
                    user={user}
                    conversations={conversations}
                    collapsed={collapsed}
                    onCollapse={() => setCollapsed(true)}
                    onExpand={() => setCollapsed(false)}
                />
            </div>

            {/* Mobile drawer */}
            <MobileSidebarDrawer
                user={user}
                conversations={conversations}
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <main className="flex-1 flex flex-col overflow-hidden min-w-0 will-change-auto">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center justify-between px-4 py-2 flex-shrink-0 border-b border-[#0D1B2A]/8 bg-[#FFF8F0]">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg text-[#0D1B2A]/50 hover:bg-[#0D1B2A]/6 transition-colors"
                        aria-label="Open menu"
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                    <span className="text-base font-extrabold text-[#0D1B2A]" style={{ fontFamily: "var(--font-heading)" }}>
                        Scope<span className="text-[#2EC4B6]">It</span>
                    </span>
                    <div className="w-9" />
                </div>

                {children}
            </main>

            {/* Onboarding tour — shown once per browser via localStorage */}
            {showTour && (
                <OnboardingTour
                    hasDisplayName={hasDisplayName}
                    userEmail={user.email ?? ""}
                    onDone={dismissTour}
                />
            )}
        </div>
    );
}
