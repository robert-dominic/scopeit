"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { GrGithub } from "react-icons/gr";

type Mode = "login" | "signup";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
    const [mode, setMode] = useState<Mode>("signup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const supabase = createClient();

    function reset() {
        setError(null);
        setSuccess(null);
        setEmail("");
        setPassword("");
    }

    function switchMode(m: Mode) {
        setMode(m);
        reset();
    }

    async function handleEmailAuth(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (mode === "signup") {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
            });
            if (error) setError(error.message);
            else setSuccess("Check your email to confirm your account.");
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) setError(error.message);
            else window.location.href = "/chat";
        }

        setLoading(false);
    }

    async function handleGitHub() {
        setLoading(true);
        await supabase.auth.signInWithOAuth({
            provider: "github",
            options: { redirectTo: `${window.location.origin}/api/auth/callback` },
        });
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-7 pointer-events-auto relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-[#0D1B2A] font-[var(--font-heading)]">
                                    {mode === "signup" ? "Get started free" : "Welcome back"}
                                </h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    {mode === "signup"
                                        ? "Scope your first idea in minutes."
                                        : "Sign in to continue with Scout."}
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGitHub}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-gray-200 text-sm font-medium text-[#0D1B2A] hover:bg-gray-50 transition-colors disabled:opacity-50 mb-4"
                            >
                                <GrGithub size={16} />
                                Continue with GitHub
                            </motion.button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 h-px bg-gray-100" />
                                <span className="text-xs text-gray-400">or</span>
                                <div className="flex-1 h-px bg-gray-100" />
                            </div>

                            <form onSubmit={handleEmailAuth} className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0D1B2A] placeholder:text-gray-400 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0D1B2A] placeholder:text-gray-400 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all"
                                />

                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-xs text-red-500"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                    {success && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-xs text-[#2EC4B6]"
                                        >
                                            {success}
                                        </motion.p>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-xl bg-[#2EC4B6] text-white text-sm font-semibold hover:bg-[#26AFA2] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 size={14} className="animate-spin" />}
                                    {mode === "signup" ? "Create account" : "Sign in"}
                                </motion.button>
                            </form>

                            <p className="text-center text-xs text-gray-400 mt-5">
                                {mode === "signup" ? "Already have an account? " : "Don't have an account? "}
                                <button
                                    onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
                                    className="text-[#2EC4B6] font-semibold hover:underline"
                                >
                                    {mode === "signup" ? "Sign in" : "Sign up"}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
