"use client";

import { useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

interface Props {
    onSubmit: (message: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export default function ChatInput({ onSubmit, isLoading, disabled }: Props) {
    const [value, setValue] = useState("");

    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        if (!value.trim() || isLoading || disabled) return;
        onSubmit(value.trim());
        setValue("");
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 bg-white border border-[var(--color-border)] rounded-2xl px-4 py-3 focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-primary-light)] transition-all shadow-sm">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What are you building?"
                    rows={1}
                    disabled={disabled}
                    className="flex-1 text-sm text-[var(--color-dark)] placeholder:text-[var(--color-muted)] bg-transparent outline-none resize-none leading-relaxed max-h-40 overflow-y-auto disabled:opacity-50"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                />
                <button
                    type="submit"
                    disabled={!value.trim() || isLoading || disabled}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <ArrowUp size={14} />
                    )}
                </button>
            </div>
            <p className="text-xs text-[var(--color-muted)] text-center mt-2">
                Press Enter to send · Shift + Enter for new line
            </p>
        </form>
    );
}
