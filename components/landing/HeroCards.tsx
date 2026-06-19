"use client";

import { motion } from "framer-motion";
import { FileText, Ban } from "lucide-react";
import Image from "next/image";

export default function HeroCards() {
    return (
        <>
            {/* Mobile — stacked cards */}
            <div className="md:hidden flex flex-col gap-4 pt-6">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="w-full bg-[#FFE27A] rounded-2xl p-5"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={14} className="text-[#0D1B2A]/60" />
                        <span className="text-xs font-bold text-[#0D1B2A]/70">Scope Document</span>
                    </div>
                    <p className="text-sm font-bold text-[#0D1B2A] mb-3">Budgeting app for students</p>
                    <div className="flex flex-wrap gap-2">
                        {["MVP Features", "Roadmap", "Tech Stack"].map((item) => (
                            <span key={item} className="text-xs text-[#0D1B2A]/65 font-medium bg-[#0D1B2A]/8 px-3 py-1 rounded-full">
                                {item}
                            </span>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="w-full bg-[#C7EEF5] rounded-2xl p-5"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Ban size={14} className="text-[#0D1B2A]/60" />
                        <span className="text-xs font-bold text-[#0D1B2A]/70">Anti-Scope</span>
                    </div>
                    <p className="text-xs text-[#0D1B2A]/65 leading-relaxed font-medium">
                        Skip admin panels before you have users
                    </p>
                    <p className="text-xs text-[#0D1B2A]/65 leading-relaxed font-medium mt-1.5">
                        No premature scalability work
                    </p>
                </motion.div>
            </div>

            {/* Desktop — absolute floating layout */}
            <div className="hidden md:block relative w-full h-[480px]">

                {/* Scout — above yellow & blue (z-25) */}
                <Image
                    src="/scout.png"
                    alt="Scout"
                    width={600}
                    height={600}
                    className="absolute w-[480px] h-[480px] object-contain pointer-events-none"
                    style={{ zIndex: 25, bottom: "-20%", left: "40%", transform: "translateX(-40%)" }}
                    priority
                />

                {/* Card 1 — yellow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute left-0 top-5 w-60 bg-[#FFE27A] rounded-2xl p-6 z-10"
                    style={{ rotate: "-4deg" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <FileText size={14} className="text-[#0D1B2A]/60" />
                        <span className="text-xs font-bold text-[#0D1B2A]/70">Scope Document</span>
                    </div>
                    <p className="text-sm font-bold text-[#0D1B2A] mb-4">Budgeting app for students</p>
                    <div className="space-y-2.5">
                        {["MVP Features", "Roadmap", "Tech Stack"].map((item) => (
                            <div key={item} className="flex items-center gap-2.5">
                                <div className="w-3.5 h-3.5 rounded border-2 border-[#0D1B2A]/30 flex-shrink-0" />
                                <span className="text-xs text-[#0D1B2A]/65 font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Card 2 — blue */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="absolute right-0 top-18 w-52 bg-[#C7EEF5] rounded-2xl p-6 z-20"
                    style={{ rotate: "3deg" }}
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Ban size={14} className="text-[#0D1B2A]/60" />
                        <span className="text-xs font-bold text-[#0D1B2A]/70">Anti-Scope</span>
                    </div>
                    <p className="text-xs text-[#0D1B2A]/65 leading-relaxed font-medium">
                        Skip admin panels before you have users
                    </p>
                    <p className="text-xs text-[#0D1B2A]/65 leading-relaxed font-medium mt-2">
                        No premature scalability work
                    </p>
                </motion.div>
            </div>
        </>
    );
}
