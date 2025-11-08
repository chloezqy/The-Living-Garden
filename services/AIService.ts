import OpenAI from "openai";
import { Spirit, Archetype } from "../types";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

// 生成 Spirit Profile
export const generateSpiritProfile = async (
  answers: { question: string; answer: string }[]
): Promise<Omit<Spirit, "id" | "activityState">> => {
  if (!import.meta.env.VITE_OPENROUTER_KEY) {
    throw new Error("OPENAI_API_KEY not found in environment");
  }

  // 构造 prompt
  const prompt = `
You are a nature-spirit generator. Based on a user's answers to abstract questions, generate a Spirit profile as JSON.

The profile must have:
{
  "archetype": "plant" | "animal" | "cloud",
  "traits": ["adjective1", "adjective2"],
  "colorPalette": ["#hex1", "#hex2", "#hex3"],
  "motionStyle": "floating" | "swaying" | "darting",
  "growth": {
    "branching": 0.0-1.0,
    "curl": 0.0-1.0,
    "pulse": 0.0-1.0
  }
}

Interpret each answer metaphorically and ensure numeric values are between 0 and 1.

Answers:
${answers.map((a) => `- ${a.question}: ${a.answer}`).join("\n")}
Return only JSON with no explanations.
`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // 可换成 claude-3.5-sonnet / mixtral 等
      messages: [
        { role: "system", content: "You generate JSON spirit profiles for a digital garden." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }, // ✅ 强制返回 JSON
    });

    const spiritData = response.choices[0].message?.content;
    if (!spiritData) throw new Error("Empty response from model");

    const parsed = JSON.parse(spiritData);

    // 验证结构
    if (!parsed.archetype || !parsed.traits || !parsed.colorPalette) {
      throw new Error("Invalid spirit data structure");
    }

    return parsed as Omit<Spirit, "id" | "activityState">;

  } catch (error) {
    console.error("Error generating spirit profile:", error);
    // Fallback 默认值
    return {
      archetype: "plant" as Archetype,
      traits: ["resilient", "calm"],
      colorPalette: ["#A8DADC", "#457B9D", "#1D3557"],
      motionStyle: "swaying",
      growth: { branching: 0.5, curl: 0.5, pulse: 0.5 },
    };
  }
};
