import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Footer from "@/components/landing/Footer";

export default async function RootPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) redirect("/chat");

    return (
        <main className="min-h-screen bg-[#FFF8F0]">
            <Navbar />
            <Hero />
            <Footer />
        </main>
    );
}
