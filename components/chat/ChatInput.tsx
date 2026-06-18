"use client";

import { useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

const INDUSTRIES = ["Fintech", "Health", "Education", "Social", "Other"];
const EXPERIENCES = ["Beginner", "Intermediate", "Advanced"];

const EXAMPLE_PROMPTS = [
    "A budgeting app for college students",
    "A marketplace for local tutors",
    "A health tracker for new moms",
    "A SaaS tool for freelance designers",
];

interface ChatInputProps {
    onSubmit: (idea: string, industry: string, experience: string) => void;
    isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
    const [idea, setIdea] = useState("");
    const [industry, setIndustry] = useState("other");
    const [experience, setExperience] = useState("intermediate");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!idea.trim() || isLoading) return;
        onSubmit(idea.trim(), industry, experience);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e as any);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            {/* Example prompts */}
            <div className="grid grid-cols-2 gap-2">
                {EXAMPLE_PROMPTS.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => setIdea(prompt)}
                        className="text-left text-xs text-[#6B7280] bg-white border border-[#D4CFC7] rounded-xl px-3 py-2.5 hover:border-[#2EC4B6] hover:text-[#0D1B2A] transition-all duration-200 leading-relaxed"
                    >
                        {prompt}
                    </button>
                ))}
            </div>

            {/* Input box */}
            <form onSubmit={handleSubmit}>
                <div className="bg-white border border-[#D4CFC7] rounded-2xl overflow-hidden focus-within:border-[#2EC4B6] focus-within:ring-2 focus-within:ring-[#2EC4B6]/20 transition-all">
                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe your idea here..."
                        rows={4}
                        className="w-full px-4 pt-4 pb-2 text-sm text-[#0D1B2A] placeholder:text-[#6B7280] bg-transparent outline-none resize-none"
                    />

                    {/* Bottom bar */}
                    <div className="flex items-center justify-between px-4 pb-3 pt-1">
                        <div className="flex items-center gap-2">
                            {/* Industry dropdown */}
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="text-xs text-[#6B7280] bg-[#F5F0E8] border-0 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:bg-[#E8E4DC] transition-colors"
                            >
                                {INDUSTRIES.map((i) => (
                                    <option key={i} value={i.toLowerCase()}>
                                        {i}
                                    </option>
                                ))}
                            </select>

                            {/* Experience dropdown */}
                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="text-xs text-[#6B7280] bg-[#F5F0E8] border-0 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer hover:bg-[#E8E4DC] transition-colors"
                            >
                                {EXPERIENCES.map((e) => (
                                    <option key={e} value={e.toLowerCase()}>
                                        {e}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Send button */}
                        <button
                            type="submit"
                            disabled={!idea.trim() || isLoading}
                            className="w-8 h-8 flex items-center justify-center bg-[#2EC4B6] text-white rounded-lg hover:bg-[#0D1B2A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <ArrowUp size={14} />
                            )}
                        </button>
                    </div>
                </div>
                <p className="text-xs text-[#6B7280] text-center mt-2">
                    ⌘ + Enter to submit
                </p>
            </form>
        </div>
    );
}