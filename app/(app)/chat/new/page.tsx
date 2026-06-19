"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import ChatInput from "@/components/chat/ChatInput";

const GREETINGS = {
    morning: [
        (name: string) => `What are we building today${name ? `, ${name}` : ""}?`,
        (name: string) => `${name ? `Hey ${name} — what` : "What"}'s the idea you woke up thinking about?`,
        (name: string) => `${name ? `${name}, what` : "What"} product problem are you solving first today?`,
        (name: string) => `Got something brewing${name ? `, ${name}` : ""}? Let's scope it.`,
    ],
    afternoon: [
        (name: string) => `${name ? `${name}, what` : "What"} are you trying to untangle right now?`,
        (name: string) => `Got a half-baked idea${name ? `, ${name}` : ""}? Let's bake it.`,
        (name: string) => `What product problem is living rent-free in your head${name ? `, ${name}` : ""}?`,
        (name: string) => `${name ? `Hey ${name} — what` : "What"} are we building today?`,
    ],
    evening: [
        (name: string) => `${name ? `${name}, what` : "What"} idea won't let you rest tonight?`,
        (name: string) => `Still building${name ? `, ${name}` : ""}? Tell me what's on your mind.`,
        (name: string) => `${name ? `Hey ${name} — what` : "What"} messy idea are we cleaning up?`,
        (name: string) => `What are you planning to ship${name ? `, ${name}` : ""}?`,
    ],
};

function getGreeting(name: string) {
    const hour = new Date().getHours();
    const period = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
    const options = GREETINGS[period];
    const fn = options[Math.floor(Math.random() * options.length)];
    return fn(name);
}

export default function NewChatPage() {
    const router = useRouter();
    const [greeting, setGreeting] = useState("");
    const convIdRef = useRef<string | null>(null);

    useEffect(() => {
        async function init() {
            const supabase = createClient();
            const [{ data: { user } }, convRes] = await Promise.all([
                supabase.auth.getUser(),
                fetch("/api/conversations", { method: "POST" }),
            ]);

            const name =
                user?.user_metadata?.full_name ||
                user?.user_metadata?.name ||
                user?.user_metadata?.display_name ||
                "";
            setGreeting(getGreeting(name.split(" ")[0]));

            if (convRes.ok) {
                const conv = await convRes.json();
                convIdRef.current = conv.id;
            }
        }
        init();
    }, []);

    function handleSubmit(message: string) {
        if (!convIdRef.current) return;
        router.push(`/chat/${convIdRef.current}?first=${encodeURIComponent(message)}`);
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden bg-[#FFF8F0] relative">
            {/* Greeting — vertically centered in the space above input */}
            <div className="flex-1 flex items-center justify-center px-4 md:px-6 pb-4">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: greeting ? 1 : 0, y: greeting ? 0 : 10 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-xl md:text-2xl font-semibold text-[#0D1B2A] text-center max-w-xl leading-snug"
                    style={{ fontFamily: "var(--font-body)" }}
                >
                    {greeting}
                </motion.h1>
            </div>

            {/* Input pinned to bottom */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: greeting ? 1 : 0, y: greeting ? 0 : 8 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex-shrink-0 px-3 md:px-6 pb-5 md:pb-6"
            >
                <div className="max-w-2xl mx-auto">
                    <ChatInput onSubmit={handleSubmit} isLoading={false} />
                </div>
            </motion.div>
        </div>
    );
}
