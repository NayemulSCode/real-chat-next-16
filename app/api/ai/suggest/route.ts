// app/api/ai/suggest/route.ts
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { message, conversationHistory } = await request.json();

    // Format the conversation history for OpenAI
    const formattedHistory = conversationHistory.map((msg: any) => ({
      role: msg.isOwn ? "user" : "assistant",
      content: msg.text,
    }));

    // Add the current message to the conversation
    formattedHistory.push({
      role: "user",
      content: message,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant in a chat application. Provide a brief, friendly response to the user's message. Keep your response under 100 words.",
        },
        ...formattedHistory,
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const suggestion = response.choices[0]?.message?.content || "";

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error generating AI suggestion:", error);
    return NextResponse.json(
      { message: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
