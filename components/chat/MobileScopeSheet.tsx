"use client";

import { X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScopeDocument } from "@/lib/types";
import ScopeDocumentView from "./ScopeDocumentView";
import { exportScopePDF } from "./ScopePreviewCard";

interface Props {
    scope: ScopeDocument | null;
    scopeId: string | null;
    open: boolean;
    onClose: () => void;
}

export default function MobileScopeSheet({ scope, scopeId: _scopeId, open, onClose }: Props) {
    return (
        <AnimatePresence>
            {open && scope && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
                        onClick={onClose}
                    />

                    {/* Sheet — slides up from bottom */}
                    <motion.div
                        key="sheet"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                        className="fixed inset-x-0 bottom-0 z-50 bg-[#FFF8F0] rounded-t-2xl flex flex-col md:hidden"
                        style={{ maxHeight: "92dvh" }}
                    >
                        {/* Drag handle pill */}
                        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                            <div className="w-10 h-1 rounded-full bg-[#0D1B2A]/15" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-[#0D1B2A]/8 flex-shrink-0">
                            <span className="text-xs font-bold text-[#0D1B2A]/35 uppercase tracking-widest">
                                Scope Document
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => exportScopePDF(scope)}
                                    className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg text-[#0D1B2A]/50 hover:text-[#0D1B2A] hover:bg-[#0D1B2A]/6 transition-colors"
                                >
                                    <Download size={14} />
                                    Export
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg text-[#0D1B2A]/35 hover:text-[#0D1B2A] hover:bg-[#0D1B2A]/6 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-5 py-6">
                            <ScopeDocumentView scope={scope} />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
