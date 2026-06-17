"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, ArrowRight, Loader2 } from "lucide-react";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const supabase = createClient();

    async function handleMagicLink(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        setSent(true);
        setLoading(false);
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

                {!sent ? (
                    <>
                        {/* Header */}
                        <div className="space-y-1 mb-8">
                            <h2 className="text-2xl font-bold text-[#0D1B2A]">
                                Welcome to Scope<span className="text-[#2EC4B6]">It</span>
                            </h2>
                            <p className="text-sm text-[#6B7280]">
                                Enter your email — we'll send you a magic link. No password needed.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleMagicLink} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-[#0D1B2A]">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-[#D4CFC7] bg-white text-[#0D1B2A] placeholder:text-[#6B7280] focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-[#FF6B6B]">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full flex items-center justify-center gap-2 bg-[#2EC4B6] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0D1B2A] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <>
                                        Send Magic Link <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Success state */
                    <div className="text-center space-y-4 py-4">
                        <div className="w-16 h-16 bg-[#2EC4B6]/10 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-3xl">📬</span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-[#0D1B2A]">
                                Check your inbox
                            </h3>
                            <p className="text-sm text-[#6B7280]">
                                We sent a link to{" "}
                                <span className="font-medium text-[#0D1B2A]">{email}</span>.
                                Click it to sign in.
                            </p>
                        </div>
                        <button
                            onClick={() => { setSent(false); setEmail(""); }}
                            className="text-sm text-[#2EC4B6] hover:underline"
                        >
                            Use a different email
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}