"use client";

import { FileText, ArrowRight } from "lucide-react";
import { ScopeJSON } from "@/lib/types";

interface ScopePreviewCardProps {
    scope: ScopeJSON;
    onView: () => void;
}

export default function ScopePreviewCard({ scope, onView }: ScopePreviewCardProps) {
    return (
        <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-[#2EC4B6]/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <span className="text-sm">🔍</span>
            </div>
            <button
                onClick={onView}
                className="max-w-sm bg-white border border-[#D4CFC7] rounded-2xl rounded-bl-sm p-4 space-y-3 hover:border-[#2EC4B6] hover:shadow-md transition-all duration-200 text-left accent-border-left"
            >
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-[#2EC4B6]" />
                    <span className="text-xs font-semibold text-[#2EC4B6] uppercase tracking-wider">
                        Scope Ready
                    </span>
                </div>
                <div>
                    <p className="font-semibold text-[#0D1B2A] text-sm">
                        {scope.product_direction}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                        {scope.problem}
                    </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-[#2EC4B6]">
                    View Full Scope <ArrowRight size={12} />
                </div>
            </button>
        </div>
    );
}