import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/");
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[#FFF8F0]">
            {/* Left Sidebar */}
            <aside className="w-60 flex-shrink-0 border-r border-[#D4CFC7] bg-white flex flex-col">
                <div className="p-4 border-b border-[#D4CFC7] flex items-center justify-between">
                    <span className="text-sm font-bold">
                        Scope<span className="text-[#2EC4B6]">It</span>
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto p-3">
                    <p className="text-xs text-[#6B7280] px-2 py-1">History coming soon</p>
                </div>
            </aside>

            {/* Center */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}