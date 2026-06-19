"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

interface Props {
    onSubmit: (message: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export default function ChatInput({ onSubmit, isLoading, disabled }: Props) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        if (!value.trim() || isLoading || disabled) return;
        onSubmit(value.trim());
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-end gap-3 bg-white border border-[#0D1B2A]/10 rounded-xl px-5 py-3.5 focus-within:border-[#0D1B2A]/20 transition-colors">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a message..."
                    rows={1}
                    disabled={disabled}
                    className="flex-1 text-base text-[#0D1B2A] placeholder:text-[#0D1B2A]/30 bg-transparent outline-none resize-none leading-relaxed max-h-48 overflow-y-auto disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!value.trim() || isLoading || disabled}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-[#2EC4B6] text-white rounded-full hover:bg-[#26AFA2] transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={15} />}
                </button>
            </div>
        </form>
    );
}
