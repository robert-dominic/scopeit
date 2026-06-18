import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: conversations } = await supabase
        .from("conversations")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="h-screen flex overflow-hidden bg-[var(--color-bg)]">
            <Sidebar user={user} conversations={conversations ?? []} />
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                {children}
            </main>
        </div>
    );
}
