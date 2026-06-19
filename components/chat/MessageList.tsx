"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/lib/types";
import ScopePreviewCard from "./ScopePreviewCard";

interface MessageListProps {
    messages: ChatMessage[];
    isLoading: boolean;
    loadingStatus: string;
    onViewScope: () => void;
    bottomRef: React.RefObject<HTMLDivElement | null>;
}

export default function MessageList({ messages, isLoading, loadingStatus, onViewScope, bottomRef }: MessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-8">
            <div className="max-w-3xl mx-auto space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                        if (msg.content === "__SCOPE__" && msg.scopeData) {
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ScopePreviewCard
                                        scope={msg.scopeData}
                                        onView={onViewScope}
                                    />
                                </motion.div>
                            );
                        }
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xl text-base leading-relaxed px-4 py-3 rounded-xl border ${msg.role === "user"
                                        ? "bg-[#0D1B2A] text-white border-transparent"
                                        : "text-[#0D1B2A] border-[#0D1B2A]/10 bg-white"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <p className="text-base text-[#0D1B2A]/35 italic animate-pulse">
                            {loadingStatus || "ScopeIt is thinking…"}
                        </p>
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
