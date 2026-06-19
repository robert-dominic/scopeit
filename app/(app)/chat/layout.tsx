import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarShell from "@/components/sidebar/SidebarShell";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/");

    const { data: conversations } = await supabase
        .from("conversations")
        .select("id, title, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <SidebarShell user={user} conversations={conversations ?? []}>
            {children}
        </SidebarShell>
    );
}
