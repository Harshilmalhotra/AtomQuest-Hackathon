import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { text, title, thrustArea } = await req.json();

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Hackathon Fallback: If no API key is provided, mock a realistic AI response
    if (!apiKey) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return NextResponse.json({
        result: `Specific: Improve [metric] related to ${title || "the goal"}.\nMeasurable: Track progress using exact numeric KPIs under the ${thrustArea || "selected"} area.\nAchievable: Ensure resources are aligned to meet this target within the quarter.\nRelevant: Directly aligns with our broader company strategic objectives.\nTime-bound: Must be completed by the end of Q4 2026.\n\nSummary: Drive a measurable increase in performance by systematically tracking core metrics and ensuring cross-functional alignment by Q4.`
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert HR Performance Coach.
      A user is trying to write a goal description for their Quarterly Goal Sheet.
      
      Current Title: ${title || "Not provided"}
      Thrust Area: ${thrustArea || "Not provided"}
      Current Description/Draft: "${text}"

      Rewrite their description into a highly professional "SMART" Goal format (Specific, Measurable, Achievable, Relevant, Time-bound). 
      Format your response cleanly. Be encouraging but very concise. Do not use markdown headers, just plain text with line breaks or bullet points.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({ result: responseText });

  } catch (error) {
    console.error("[SMART_GOAL_AI]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
