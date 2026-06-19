import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SidebarShell from "@/components/sidebar/SidebarShell";
import PendoIdentify from "@/components/PendoIdentify";

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
        <>
            <PendoIdentify userId={user.id} email={user.email ?? ""} />
            <SidebarShell user={user} conversations={conversations ?? []}>
                {children}
            </SidebarShell>
        </>
    );
}
