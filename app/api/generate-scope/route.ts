import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function loadPrompt(...parts: string[]): string {
    return fs.readFileSync(
        path.join(process.cwd(), "lib", "prompts", ...parts),
        "utf8"
    );
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { idea, industry = "other", experience = "intermediate" } =
            await request.json();

        if (!idea?.trim()) {
            return Response.json({ error: "Idea is required" }, { status: 400 });
        }

        const basePrompt = loadPrompt("base.txt");
        const industryPrompt = loadPrompt("industry", `${industry.toLowerCase()}.txt`);
        const experiencePrompt = loadPrompt("experience", `${experience.toLowerCase()}.txt`);

        const systemPrompt = [basePrompt, industryPrompt, experiencePrompt].join("\n\n");

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: idea },
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
            max_tokens: 2000,
        });

        const raw = completion.choices[0].message.content ?? "";
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const scope = JSON.parse(cleaned);

        const title = idea.slice(0, 60);
        const { data: project, error: dbError } = await supabase
            .from("projects")
            .insert({
                user_id: user.id,
                title,
                idea,
                industry,
                experience,
                generated_scope: scope,
            })
            .select()
            .single();

        if (dbError) throw new Error(dbError.message);

        return Response.json({ scope, id: project.id });
    } catch (err: any) {
        console.error("Generate scope error:", err);
        return Response.json(
            { error: err.message ?? "Generation failed" },
            { status: 500 }
        );
    }
}