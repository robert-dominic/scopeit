"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";
import { GrGithub } from "react-icons/gr";

type Mode = "login" | "signup";

export default function LoginPage() {
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const supabase = createClient();

    async function handleEmailAuth(e: React.SyntheticEvent) {
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
        <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-bg)]">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[var(--color-dark)]">
                        Scope<span className="text-[var(--color-primary)]">It</span>
                    </h1>
                    <p className="text-sm text-[var(--color-muted)] mt-1">
                        {mode === "login" ? "Welcome back." : "Create your account."}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-sm space-y-4">

                    {/* GitHub */}
                    <button
                        onClick={handleGitHub}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-dark)] hover:bg-[var(--color-bg)] transition-colors disabled:opacity-50"
                    >
                        <GrGithub size={16} />
                        Continue with GitHub
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-[var(--color-border)]" />
                        <span className="text-xs text-[var(--color-muted)]">or</span>
                        <div className="flex-1 h-px bg-[var(--color-border)]" />
                    </div>

                    {/* Email form */}
                    <form onSubmit={handleEmailAuth} className="space-y-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] bg-white outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] bg-white outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] transition-all"
                        />

                        {error && (
                            <p className="text-xs text-red-500">{error}</p>
                        )}
                        {success && (
                            <p className="text-xs text-[var(--color-primary)]">{success}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={14} className="animate-spin" />}
                            {mode === "login" ? "Sign in" : "Create account"}
                        </button>
                    </form>
                </div>

                {/* Toggle */}
                <p className="text-center text-xs text-[var(--color-muted)] mt-4">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setSuccess(null); }}
                        className="text-[var(--color-primary)] font-medium hover:underline"
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
