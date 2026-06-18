"use client";

import { X, Maximize2, Minimize2, Download, RefreshCw } from "lucide-react";
import ScopeCard from "./ScopeCard";
import { ScopeJSON } from "@/lib/types";

interface ScopePanelProps {
    scope: ScopeJSON;
    onClose: () => void;
}

export default function ScopePanel({ scope, onClose }: ScopePanelProps) {
    return (
        <aside className="w-[420px] flex-shrink-0 border-l border-[#D4CFC7] bg-white flex flex-col overflow-hidden">
            {/* Sticky top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#D4CFC7] flex-shrink-0">
                <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    Scope Card
                </span>
                <div className="flex items-center gap-2">
                    <button
                        className="text-xs flex items-center gap-1.5 text-[#6B7280] hover:text-[#0D1B2A] transition-colors px-2 py-1 rounded-lg hover:bg-[#F5F0E8]"
                        title="Export PDF — coming soon"
                    >
                        <Download size={13} />
                        Export
                    </button>
                    <button
                        className="text-xs flex items-center gap-1.5 text-[#6B7280] hover:text-[#0D1B2A] transition-colors px-2 py-1 rounded-lg hover:bg-[#F5F0E8]"
                        title="Refine — coming soon"
                    >
                        <RefreshCw size={13} />
                        Refine
                    </button>
                    <button
                        onClick={onClose}
                        className="text-[#6B7280] hover:text-[#0D1B2A] transition-colors p-1 rounded-lg hover:bg-[#F5F0E8]"
                    >
                        <X size={15} />
                    </button>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-5 pt-5">
                <ScopeCard scope={scope} />
            </div>
        </aside>
    );
}