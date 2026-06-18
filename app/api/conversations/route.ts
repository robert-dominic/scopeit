import { createClient } from "@/lib/supabase/server";

export async function POST() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
        .from("conversations")
        .insert({ user_id: user.id })
        .select("id, title, created_at")
        .single();

    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data);
}
