import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    // Fetch user's projects
    const { data: projects } = await supabase
        .from("projects")
        .select("id, title, is_favorite, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="h-screen flex overflow-hidden bg-[#FFF8F0]">
            <Sidebar user={user} projects={projects ?? []} />
            <main className="flex-1 flex flex-col overflow-hidden min-w-0">
                {children}
            </main>
        </div>
    );
}