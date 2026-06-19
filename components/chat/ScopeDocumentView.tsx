"use client";

import { XCircle } from "lucide-react";
import type { ScopeDocument } from "@/lib/types";

function DocSection({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <p className="text-xs font-bold tracking-widest text-[#0D1B2A]/35 uppercase">{label}</p>
            {children}
        </div>
    );
}

export default function ScopeDocumentView({ scope }: { scope: ScopeDocument }) {
    const phases = [scope.roadmap.phase_1, scope.roadmap.phase_2, scope.roadmap.phase_3];

    return (
        <div className="space-y-8 pb-10">
            {/* Title */}
            <div className="space-y-1 pb-2 border-b border-[#0D1B2A]/8">
                <h1 className="text-2xl font-extrabold text-[#0D1B2A] leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    {scope.product_name}
                </h1>
                <p className="text-base text-[#0D1B2A]/50">{scope.tagline}</p>
            </div>

            {/* Problem */}
            <DocSection label="The Problem">
                <p className="text-base text-[#0D1B2A]/75 leading-relaxed">{scope.problem}</p>
            </DocSection>

            {/* Target User */}
            <DocSection label="Target Users">
                <p className="text-base text-[#0D1B2A]/75 leading-relaxed">{scope.target_user}</p>
            </DocSection>

            {/* Product Goal */}
            <DocSection label="Product Goal">
                <p className="text-base text-[#0D1B2A] font-medium leading-relaxed">{scope.product_goal}</p>
            </DocSection>

            {/* What to Build */}
            <DocSection label="What to Build">
                <div className="space-y-5">
                    {scope.mvp_features.map((f, i) => (
                        <div key={i}>
                            <p className="text-base font-bold text-[#0D1B2A]">{i + 1}. {f.name}</p>
                            <p className="text-base text-[#0D1B2A]/65 leading-relaxed mt-1">{f.description}</p>
                            <p className="text-sm text-[#0D1B2A]/40 leading-relaxed mt-1 italic">Why now: {f.why}</p>
                        </div>
                    ))}
                </div>
            </DocSection>

            {/* What NOT to Build */}
            <DocSection label="What NOT to Build">
                <div className="space-y-4">
                    {scope.anti_scope.map((a, i) => (
                        <div key={i} className="flex items-start gap-3">
                            <XCircle size={16} className="text-[#0D1B2A]/30 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-base font-bold text-[#0D1B2A]">{a.item}</p>
                                <p className="text-sm text-[#0D1B2A]/55 leading-relaxed mt-0.5">{a.reason}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </DocSection>

            {/* Roadmap — stacked phases */}
            <DocSection label="Roadmap">
                <div className="space-y-0">
                    {phases.map((phase, i) => (
                        <div key={i}>
                            <div className="py-5">
                                <div className="flex items-baseline gap-3 mb-2">
                                    <p className="text-base font-bold text-[#0D1B2A]">Phase {i + 1}: {phase.title}</p>
                                    <span className="text-sm text-[#0D1B2A]/35">{phase.duration}</span>
                                </div>
                                <ul className="space-y-2">
                                    {phase.actions.map((a, j) => (
                                        <li key={j} className="flex items-start gap-3 text-base text-[#0D1B2A]/65 leading-relaxed">
                                            <span className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0D1B2A]/25 block" />
                                            {a}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {i < 2 && <div className="border-t border-[#0D1B2A]/8" />}
                        </div>
                    ))}
                </div>
            </DocSection>

            {/* Tech Stack */}
            {scope.tech_stack?.length > 0 && (
                <DocSection label="Recommended Stack">
                    <div className="space-y-4">
                        {scope.tech_stack.map((t, i) => (
                            <div key={i}>
                                <p className="text-base font-bold text-[#0D1B2A]">{t.recommended}</p>
                                <p className="text-sm text-[#0D1B2A]/55 leading-relaxed mt-0.5">{t.reason}</p>
                            </div>
                        ))}
                    </div>
                </DocSection>
            )}

            {/* Risks */}
            {scope.risks?.length > 0 && (
                <DocSection label="Risks & Mitigations">
                    <div className="space-y-4">
                        {scope.risks.map((r, i) => (
                            <div key={i}>
                                <p className="text-base font-bold text-[#0D1B2A]">{r.risk}</p>
                                <p className="text-sm text-[#0D1B2A]/55 leading-relaxed mt-0.5">→ {r.mitigation}</p>
                            </div>
                        ))}
                    </div>
                </DocSection>
            )}

            {/* Success Metrics */}
            <DocSection label="Success Metrics">
                <ul className="space-y-3">
                    {scope.success_metrics.map((m, i) => (
                        <li key={i} className="flex items-start gap-3 text-base text-[#0D1B2A]/70 leading-relaxed">
                            <span className="mt-2.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0D1B2A]/25 block" />
                            {m}
                        </li>
                    ))}
                </ul>
            </DocSection>

            {/* Next Move */}
            <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest text-[#0D1B2A]/35 uppercase">Your Next Move</p>
                <div className="bg-[#0D1B2A] rounded-2xl p-6">
                    <p className="text-base font-medium text-white leading-relaxed">{scope.next_move}</p>
                </div>
            </div>
        </div>
    );
}
