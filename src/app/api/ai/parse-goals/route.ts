import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock delay and response
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NextResponse.json({
        goals: [
          {
            title: "Increase Q3 Sales",
            description: "Boost overall revenue in the third quarter through new marketing campaigns.",
            thrustArea: "Financial",
            uomType: "MIN_NUMERIC",
            target: 500000,
            weightage: 50
          },
          {
            title: "Zero Safety Incidents",
            description: "Maintain a flawless safety record on the factory floor.",
            thrustArea: "Process",
            uomType: "ZERO",
            target: 0,
            weightage: 50
          }
        ]
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
      You are an expert HR Goal parsing assistant.
      The user has pasted a messy, unstructured text describing their goals for the upcoming quarter.
      Your job is to extract up to 8 distinct goals from the text and structure them perfectly.

      Valid Thrust Areas: "Financial", "Customer", "Process", "Learning"
      Valid UOM Types: 
        - "MIN_NUMERIC" (Higher is better, e.g. Sales, Revenue)
        - "MAX_NUMERIC" (Lower is better, e.g. Errors, Turnaround Time)
        - "TIMELINE" (Date-based completion)
        - "ZERO" (Zero incidents/defects)

      RULES:
      1. Distribute "weightage" evenly among the extracted goals so they sum exactly to 100.
      2. Ensure Target is a positive number (use 0 for ZERO uom).
      3. Return ONLY a JSON array of goal objects.

      Schema:
      [
        {
          "title": "string (max 50 chars)",
          "description": "string",
          "thrustArea": "string",
          "uomType": "string",
          "target": number,
          "weightage": number
        }
      ]

      Text to parse:
      "${text}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let parsedGoals = [];
    try {
      parsedGoals = JSON.parse(responseText);
    } catch(e) {
      console.error("Failed to parse JSON from AI", responseText);
      throw new Error("Invalid JSON from AI");
    }

    return NextResponse.json({ goals: parsedGoals });

  } catch (error) {
    console.error("[PARSE_GOALS_AI_ERROR]", error);
    // Graceful fallback for bad API key or parsing error
    return NextResponse.json({
      goals: [
        {
          title: "Achieve Primary Objective",
          description: "This is a placeholder generated because the AI parsing failed.",
          thrustArea: "Financial",
          uomType: "MIN_NUMERIC",
          target: 100,
          weightage: 100
        }
      ]
    });
  }
}
