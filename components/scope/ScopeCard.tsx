"use client";

import { ScopeJSON } from "@/lib/types";
import { Target, Scissors, Map, TrendingUp, Zap, User, Flag } from "lucide-react";

interface ScopeCardProps {
    scope: ScopeJSON;
}

export default function ScopeCard({ scope }: ScopeCardProps) {
    return (
        <div className="space-y-6 pb-8">
            {/* Product Direction */}
            <div>
                <h1 className="text-3xl font-bold text-[#0D1B2A] leading-tight">
                    {scope.product_direction}
                </h1>
            </div>

            {/* Problem */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Flag size={14} className="text-[#2EC4B6]" />
                    <span className="section-label">The Problem</span>
                </div>
                <p className="text-sm text-[#0D1B2A] leading-relaxed bg-white border border-[#D4CFC7] rounded-xl p-4">
                    {scope.problem}
                </p>
            </div>

            {/* Target User */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <User size={14} className="text-[#2EC4B6]" />
                    <span className="section-label">Target User</span>
                </div>
                <p className="text-sm text-[#0D1B2A] leading-relaxed bg-white border border-[#D4CFC7] rounded-xl p-4">
                    {scope.target_user}
                </p>
            </div>

            {/* Product Goal */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Target size={14} className="text-[#2EC4B6]" />
                    <span className="section-label">Product Goal</span>
                </div>
                <p className="text-sm font-semibold text-[#0D1B2A] leading-relaxed bg-white border border-[#D4CFC7] rounded-xl p-4">
                    {scope.product_goal}
                </p>
            </div>

            {/* MVP Scope + Anti Scope */}
            <div className="grid grid-cols-1 gap-4">
                {/* MVP Scope */}
                <div className="scope-mvp-bg border border-[#2EC4B6]/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">✅</span>
                        <span className="section-label text-[#2EC4B6]">What to Build</span>
                    </div>
                    <ul className="space-y-2">
                        {scope.mvp_scope.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-[#0D1B2A]">
                                <span className="text-[#2EC4B6] font-bold mt-0.5 flex-shrink-0">
                                    {i + 1}.
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Anti Scope */}
                <div className="scope-anti-bg border border-[#FF6B6B]/20 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">❌</span>
                        <span className="section-label text-[#FF6B6B]">What NOT to Build</span>
                    </div>
                    <ul className="space-y-3">
                        {scope.anti_scope.map((item, i) => (
                            <li key={i} className="text-sm text-[#0D1B2A] space-y-0.5">
                                <div className="flex items-start gap-2">
                                    <span className="text-[#FF6B6B] font-bold mt-0.5 flex-shrink-0">✕</span>
                                    <div>
                                        <span className="font-medium">{item.item}</span>
                                        <p className="text-[#6B7280] text-xs mt-0.5">→ {item.reason}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Roadmap */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Map size={14} className="text-[#2EC4B6]" />
                    <span className="section-label">Execution Roadmap</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {[scope.roadmap.phase_1, scope.roadmap.phase_2, scope.roadmap.phase_3].map(
                        (phase, i) => (
                            <div
                                key={i}
                                className="bg-white border border-[#D4CFC7] rounded-xl p-3 space-y-2"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-[#2EC4B6]">
                                        Phase {i + 1}
                                    </span>
                                </div>
                                <p className="text-xs font-semibold text-[#0D1B2A]">
                                    {phase.title}
                                </p>
                                <ul className="space-y-1">
                                    {phase.actions.map((action, j) => (
                                        <li key={j} className="text-xs text-[#6B7280] flex items-start gap-1">
                                            <span className="mt-0.5 flex-shrink-0">•</span>
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Success Metric */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-[#2EC4B6]" />
                    <span className="section-label">Success Metric</span>
                </div>
                <div className="bg-white border border-[#D4CFC7] rounded-xl p-4 accent-border-left">
                    <p className="text-sm font-medium text-[#0D1B2A]">
                        {scope.success_metric}
                    </p>
                </div>
            </div>

            {/* Next Move */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Zap size={14} className="text-[#2EC4B6]" />
                    <span className="section-label">Your Next Move</span>
                </div>
                <div className="bg-[#0D1B2A] rounded-xl p-4">
                    <p className="text-sm font-medium text-[#FFF8F0] leading-relaxed">
                        {scope.next_move}
                    </p>
                </div>
            </div>
        </div>
    );
}