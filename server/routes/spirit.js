import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/", async (req, res) => {
  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: "Missing answers" });

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL || "https://openrouter.ai/api/v1",
  });

  const prompt = `
You are a nature-spirit generator.
Based on these quiz answers, generate a JSON object with:
{
 "archetype": "plant" | "animal" | "cloud",
 "traits": ["gentle","curious"],
 "colorPalette": ["#A8DADC","#457B9D","#1D3557"],
 "motionStyle": "swaying",
 "growth": {"branching":0.6,"curl":0.4,"pulse":0.7}
}
Answers:
${answers.map(a => `- ${a.question}: ${a.answer}`).join("\n")}
Return only valid JSON.
  `;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You generate JSON spirit profiles for The Living Garden." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(completion.choices[0].message.content);
    res.json(data);
  } catch (err) {
    console.error("Spirit generation error:", err);
    res.status(500).json({ error: "Failed to generate spirit" });
  }
});

export default router;
