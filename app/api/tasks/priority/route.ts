// /app/api/tasks/priority/route.ts

import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure it's set in .env.local
});

export async function POST(req: NextRequest) {
  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Task title is required" }, { status: 400 });
  }
  const allowedPriorities = ["High", "Medium", "Low"];
  try {
    const prompt = `Assign a priority (High, Medium, or Low) to this task: "${title}". Only respond with one word: High, Medium, or Low.`;

    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const aiPriorityRaw = response.choices?.[0]?.message?.content ?? "";
    const aiPriority = aiPriorityRaw.trim().charAt(0).toUpperCase() + aiPriorityRaw.trim().slice(1).toLowerCase();

    if (!allowedPriorities.includes(aiPriority)) {
    throw new Error(`Invalid priority from AI: ${aiPriority}`);
    }



    return NextResponse.json({ priority: aiPriority });
  } catch (error) {
    console.error("Priority prediction error:", error);
    // return NextResponse.json({ error: "Failed to get priority" }, { status: 500 });
    return NextResponse.json({priority: "Medium"});
  }
}