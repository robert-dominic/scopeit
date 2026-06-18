"use client";

import { useEffect, useRef } from "react";

export type Message = {
    id: string;
    role: "user" | "scout";
    content: string;
    isProgress?: boolean;
    scopeData?: any;
};

interface ChatMessagesProps {
    messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    {msg.role === "scout" && (
                        <div className="w-7 h-7 rounded-full bg-[#2EC4B6]/15 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                            <span className="text-sm">🔍</span>
                        </div>
                    )}
                    <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                            ? "bg-[#0D1B2A] text-[#FFF8F0] rounded-br-sm"
                            : msg.isProgress
                                ? "bg-transparent text-[#6B7280] italic"
                                : "bg-white border border-[#D4CFC7] text-[#0D1B2A] rounded-bl-sm"
                            }`}
                    >
                        {msg.content}
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}