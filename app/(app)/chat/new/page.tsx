"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInput from "@/components/chat/ChatInput";

const STARTERS = [
    "I want to build a budgeting app for college students",
    "An AI tool that helps freelancers write proposals",
    "A platform for local tutors to find students",
    "A habit tracker that actually keeps you accountable",
];

export default function NewChatPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);

    // If we have a pending message, create a conversation and navigate to it
    useEffect(() => {
        if (!pendingMessage) return;

        async function createAndNavigate() {
            const res = await fetch("/api/conversations", { method: "POST" });
            if (!res.ok) { setIsLoading(false); return; }
            const conv = await res.json();
            // Navigate to the conversation page, carrying the first message as a param
            router.push(`/chat/${conv.id}?first=${encodeURIComponent(pendingMessage!)}`);
        }

        createAndNavigate();
    }, [pendingMessage, router]);

    function handleSubmit(message: string) {
        setIsLoading(true);
        setPendingMessage(message);
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 gap-8">
                <div className="text-center space-y-2 max-w-md">
                    <h2 className="text-2xl font-bold text-[var(--color-dark)]">
                        What are you building?
                    </h2>
                    <p className="text-base text-[var(--color-muted)]">
                        Share your idea — even the messy half-formed ones.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
                    {STARTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSubmit(s)}
                            disabled={isLoading}
                            className="text-left text-sm text-[var(--color-muted)] bg-white border border-[var(--color-border)] rounded-xl px-4 py-3 hover:border-[var(--color-primary)] hover:text-[var(--color-dark)] transition-all leading-relaxed disabled:opacity-50"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="w-full max-w-xl">
                    <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
