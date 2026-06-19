"use client";

import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="bg-[#0D1B2A] text-white overflow-hidden">

            {/* Main content */}
            <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
                {/* Brand */}
                <p
                    className="text-2xl font-extrabold text-white mb-3 tracking-tight"
                    style={{ fontFamily: "var(--font-heading)" }}
                >
                    Scope<span className="text-[#2EC4B6]">It</span>
                </p>
                <p className="text-sm text-white/40 max-w-xs leading-relaxed mb-12">
                    From messy idea to clear product scope — in one conversation.
                </p>

                {/* Bottom bar */}
                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <p className="text-xs text-white/25">
                        Built for{" "}
                        <span className="text-[#FFB703]/70 font-medium">Mind the Product — World Product Day 2026</span>
                    </p>
                    <p className="text-xs text-white/25">© 2026 ScopeIt. All rights reserved.</p>
                </div>
            </div>

            {/* Watermark */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                aria-hidden
            >
                <p
                    className="text-center font-extrabold text-white/[0.04] leading-none select-none pb-2"
                    style={{
                        fontSize: "clamp(60px, 14vw, 160px)",
                        fontFamily: "var(--font-heading)",
                        letterSpacing: "-0.02em",
                    }}
                >
                    ScopeIt
                </p>
            </motion.div>

        </footer>
    );
}
