"use client";

import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";
import { ImGithub } from "react-icons/im";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const supabase = createClient();

    async function handleGitHubLogin() {
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0D1B2A]/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[#FFF8F0] rounded-2xl border border-[#D4CFC7] p-8 w-full max-w-md mx-4 shadow-xl">
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#6B7280] hover:text-[#0D1B2A] transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-[#0D1B2A]">
                            Welcome to Scope<span className="text-[#2EC4B6]">It</span>
                        </h2>
                        <p className="text-sm text-[#6B7280]">
                            Sign in to save and revisit your scopes.
                        </p>
                    </div>

                    {/* GitHub button */}
                    <button
                        onClick={handleGitHubLogin}
                        className="w-full flex items-center justify-center gap-3 bg-[#0D1B2A] text-[#FFF8F0] font-semibold px-6 py-3.5 rounded-lg hover:bg-[#2EC4B6] transition-colors duration-200"
                    >
                        <ImGithub size={18} />
                        Continue with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
}