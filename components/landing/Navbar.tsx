"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "./AuthModal";

export default function Navbar() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-40 bg-[#FFF8F0]/90 backdrop-blur-sm border-b border-[#0D1B2A]/8">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Brand text */}
                    <Link href="/" className="text-xl font-extrabold text-[#0D1B2A] tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Scope<span className="text-[#2EC4B6]">It</span>
                    </Link>

                    {/* Actions — log in always visible, Get Started desktop only */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            onClick={() => setModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-[#0D1B2A] border border-[#0D1B2A]/15 hover:border-[#0D1B2A]/30 hover:bg-[#0D1B2A]/5 transition-colors"
                        >
                            Log in
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            onClick={() => setModalOpen(true)}
                            className="hidden md:block px-5 py-2 rounded-lg text-sm font-semibold bg-[#0D1B2A] text-white hover:bg-[#0D1B2A]/85 transition-colors"
                        >
                            Get Started Free
                        </motion.button>
                    </div>
                </div>
            </nav>

            <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
