"use client";

import { Download } from "lucide-react";
import type { ScopeDocument } from "@/lib/types";

export async function exportScopePDF(scope: ScopeDocument) {
    const { pdf } = await import("@react-pdf/renderer");
    const { ScopePDFDocument } = await import("@/components/scope/ScopePDF");
    const blob = await pdf(<ScopePDFDocument scope={scope} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${scope.product_name.toLowerCase().replace(/\s+/g, "-")}-scope.pdf`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function ScopePreviewCard({ scope, onView }: { scope: ScopeDocument; onView: () => void }) {
    return (
        <div
            onClick={onView}
            className="cursor-pointer flex items-center gap-4 bg-white border border-[#0D1B2A]/10 hover:border-[#0D1B2A]/20 rounded-xl px-4 py-3.5 w-full transition-all"
        >
            {/* File icon */}
            <div className="w-10 h-12 rounded-lg bg-[#0D1B2A]/6 flex items-center justify-center flex-shrink-0">
                <Download size={16} className="text-[#0D1B2A]/40" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0D1B2A] truncate">{scope.product_name} — Scope</p>
                <p className="text-xs text-[#0D1B2A]/40 mt-0.5">Document · PDF</p>
            </div>

            {/* Download button */}
            <button
                onClick={(e) => { e.stopPropagation(); exportScopePDF(scope); }}
                className="flex-shrink-0 text-sm font-semibold px-3.5 py-1.5 rounded-lg bg-[#0D1B2A] text-white hover:bg-[#0D1B2A]/80 transition-colors"
            >
                Download
            </button>
        </div>
    );
}
