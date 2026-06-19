"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HERO_BADGE, HERO_HEADLINE_1, HERO_HEADLINE_2, HERO_SUBTEXT } from "@/data/landing";
import HeroCards from "./HeroCards";
import AuthModal from "./AuthModal";

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function Hero() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <section className="min-h-screen bg-[#FFF8F0] flex items-center pt-16">
                <div className="max-w-6xl mx-auto w-full px-6 py-20 flex flex-col md:flex-row items-center gap-12 md:gap-8">

                    {/* Left — copy */}
                    <div className="flex-1 max-w-xl">

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2EC4B6]/12 border border-[#2EC4B6]/25 mb-6"
                        >
                            <Sparkles size={13} className="text-[#2EC4B6]" />
                            <span className="text-xs font-semibold text-[#2EC4B6]">{HERO_BADGE}</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.08, ease }}
                            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0D1B2A] leading-[1.08] tracking-tight mb-6"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {HERO_HEADLINE_1}<br />
                            {HERO_HEADLINE_2}
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.18, ease }}
                            className="text-base md:text-lg text-[#0D1B2A]/55 leading-relaxed mb-10"
                        >
                            {HERO_SUBTEXT}
                        </motion.p>

                        {/* CTAs — two on desktop, one on mobile */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.28, ease }}
                            className="flex flex-wrap gap-3"
                        >
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                onClick={() => setModalOpen(true)}
                                className="px-7 py-3.5 rounded-lg bg-[#0D1B2A] text-white text-sm font-semibold hover:bg-[#0D1B2A]/85 transition-colors"
                            >
                                Start scoping free
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                onClick={() => setModalOpen(true)}
                                className="hidden md:flex px-7 py-3.5 rounded-lg border border-[#0D1B2A]/20 text-[#0D1B2A] text-sm font-semibold hover:border-[#0D1B2A]/40 hover:bg-[#0D1B2A]/5 transition-colors"
                            >
                                See how it works
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Right — floating cards */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex-1 w-full md:max-w-lg h-[420px] relative -mt-16"
                    >
                        <HeroCards />
                    </motion.div>
                </div>
            </section>

            <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
