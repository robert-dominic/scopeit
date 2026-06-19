"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "scopeit_tour_done";

interface Step {
    tour: string;
    heading: string;
    body: string;
    position: string; // tailwind classes for positioning the card
}

const STEPS: Step[] = [
    {
        tour: "TOUR 1 OF 4 — WELCOME",
        heading: "Welcome to ScopeIt!",
        body: "ScopeIt turns your messy product ideas into clean, structured scope documents — in minutes. Let's take a quick tour.",
        position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
        tour: "TOUR 2 OF 4 — YOUR CHATS",
        heading: "Your conversations live here",
        body: "Every product idea you explore gets saved in the sidebar. Start a new chat any time and pick up where you left off.",
        position: "top-1/2 left-4 md:left-72 -translate-y-1/2",
    },
    {
        tour: "TOUR 3 OF 4 — SCOUT",
        heading: "Talk to Scout",
        body: "Scout is your AI product partner. Describe your idea in plain English — Scout will ask the right questions and guide you to clarity.",
        position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    },
    {
        tour: "TOUR 4 OF 4 — SCOPE DOCUMENT",
        heading: "Your scope document",
        body: "Once Scout understands your idea, it generates a full scope document — problem, goals, roadmap, risks, and your next move. Export it as a PDF any time.",
        position: "top-1/2 right-4 md:right-8 -translate-y-1/2",
    },
];

interface Props {
    hasDisplayName: boolean;
    userEmail: string;
    onDone: () => void;
}

export default function OnboardingTour({ hasDisplayName, userEmail, onDone }: Props) {
    const [step, setStep] = useState(0);
    const [showNameStep, setShowNameStep] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [saving, setSaving] = useState(false);
    const [nameError, setNameError] = useState("");

    const totalTourSteps = STEPS.length;
    const isLastTourStep = step === totalTourSteps - 1;
    const emailFallback = userEmail.split("@")[0];

    function handleContinue() {
        if (isLastTourStep) {
            if (!hasDisplayName) {
                setShowNameStep(true);
            } else {
                finish();
            }
        } else {
            setStep((s) => s + 1);
        }
    }

    function handleSkip() {
        if (!hasDisplayName) {
            setShowNameStep(true);
        } else {
            finish();
        }
    }

    function finish() {
        localStorage.setItem(STORAGE_KEY, "true");
        onDone();
    }

    // Called when user dismisses the name modal without submitting — save email prefix silently
    async function handleNameDismiss() {
        const supabase = createClient();
        await supabase.auth.updateUser({ data: { display_name: emailFallback } });
        finish();
    }

    async function handleSaveName(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = displayName.trim();
        if (!trimmed) { setNameError("Please enter a name."); return; }
        setSaving(true);
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
            data: { display_name: trimmed },
        });
        setSaving(false);
        if (error) { setNameError(error.message); return; }
        finish();
    }

    const current = STEPS[step];

    return (
        <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* Dim overlay — clickable only on name step to dismiss with email fallback */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={showNameStep ? handleNameDismiss : undefined}
                className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-auto"
            />

            <AnimatePresence mode="wait">
                {!showNameStep ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                        className={`absolute ${current.position} w-[calc(100vw-2rem)] max-w-sm pointer-events-auto`}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl px-7 py-6">
                            {/* Step label */}
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#2EC4B6] mb-3">
                                {current.tour}
                            </p>

                            {/* Content */}
                            <h2 className="text-base font-bold text-[#0D1B2A] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                {current.heading}
                            </h2>
                            <p className="text-sm text-[#0D1B2A]/55 leading-relaxed mb-5">
                                {current.body}
                            </p>

                            {/* Progress bar */}
                            <div className="flex gap-1.5 mb-5">
                                {STEPS.map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                                        style={{ background: i <= step ? "#0D1B2A" : "#0D1B2A1A" }}
                                    />
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleSkip}
                                    className="text-xs font-semibold text-[#0D1B2A]/35 hover:text-[#0D1B2A]/60 uppercase tracking-widest transition-colors"
                                >
                                    Skip tour
                                </button>
                                <button
                                    onClick={handleContinue}
                                    className="flex items-center gap-1.5 text-xs font-bold text-[#0D1B2A] uppercase tracking-widest hover:text-[#2EC4B6] transition-colors"
                                >
                                    {isLastTourStep ? "Done" : "Continue"}
                                    <ArrowRight size={13} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Display name collection */
                    <motion.div
                        key="name-step"
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-sm pointer-events-auto"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl px-7 py-6">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#2EC4B6] mb-3">
                                ONE LAST THING
                            </p>
                            <h2 className="text-base font-bold text-[#0D1B2A] mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                                What should we call you?
                            </h2>
                            <p className="text-sm text-[#0D1B2A]/55 leading-relaxed mb-5">
                                Scout will use this to greet you each time you start a new chat.
                            </p>

                            <form onSubmit={handleSaveName} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Your first name"
                                    value={displayName}
                                    onChange={(e) => { setDisplayName(e.target.value); setNameError(""); }}
                                    autoFocus
                                    minLength={2}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0D1B2A] placeholder:text-gray-400 outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all"
                                />
                                {nameError && (
                                    <p className="text-xs text-red-500">{nameError}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full py-3 rounded-xl bg-[#0D1B2A] text-white text-sm font-semibold hover:bg-[#0D1B2A]/85 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {saving && <Loader2 size={14} className="animate-spin" />}
                                    Let's go
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export function useShouldShowTour() {
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const done = localStorage.getItem(STORAGE_KEY);
            setShow(!done);
        }
    }, []);
    return { show, dismiss: () => setShow(false) };
}
