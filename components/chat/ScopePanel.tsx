"use client";

import { X, Download } from "lucide-react";
import { motion } from "framer-motion";
import type { ScopeDocument } from "@/lib/types";
import ScopeDocumentView from "./ScopeDocumentView";
import { exportScopePDF } from "./ScopePreviewCard";

interface ScopePanelProps {
    scope: ScopeDocument;
    scopeId: string | null;
    onClose: () => void;
    onResizeStart: (e: React.MouseEvent) => void;
}

export default function ScopePanel({ scope, scopeId: _scopeId, onClose, onResizeStart }: ScopePanelProps) {
    return (
        <aside className="relative border-l border-[#0D1B2A]/8 bg-[#FFF8F0] flex flex-col overflow-hidden h-full w-full">
            {/* Resize handle on the left edge */}
            <div
                onMouseDown={onResizeStart}
                className="absolute left-0 top-0 h-full w-1 cursor-col-resize hover:bg-[#0D1B2A]/10 transition-colors z-10"
            />
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#0D1B2A]/8 flex-shrink-0">
                <span className="text-xs font-bold text-[#0D1B2A]/35 uppercase tracking-widest">
                    Scope Document
                </span>
                <div className="flex items-center gap-1">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => exportScopePDF(scope)}
                        className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-lg text-[#0D1B2A]/50 hover:text-[#0D1B2A] hover:bg-[#0D1B2A]/6 transition-colors"
                    >
                        <Download size={14} />
                        Export as PDF
                    </motion.button>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-[#0D1B2A]/35 hover:text-[#0D1B2A] hover:bg-[#0D1B2A]/6 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide px-7 py-7">
                <ScopeDocumentView scope={scope} />
            </div>
        </aside>
    );
}
