import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    try {
        const { taskTitle }= await req.json();

        if (!taskTitle) {
            return NextResponse.json({ error: "Task Title is required" }, { status: 400 });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You're an AI assistant that classifies tasks based on urgency and importance." },
                { role: "user", content: `Classify this task: "${taskTitle}"` }
            ],
            max_tokens: 10,
        });

        const priority = response.choices[0]?.message?.content?.trim() || "Medium Priority";
        return NextResponse.json({ priority }, { status: 200 });

    } catch (error) {
        const err = error as Error;
        console.error("API Error:", err.message);
        return NextResponse.json({ error: err.message || "Failed to process request" }, { status: 500 });
    }
}