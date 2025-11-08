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
You are a creative interpreter that transforms symbolic quiz answers into nature spirits
for a shared digital garden.

Each spirit can be one of three archetypes:
- "plant" → grounded, growing, resilient
- "animal" → lively, instinctual, expressive
- "cloud" → dreamy, free, imaginative

Each spirit has:
- 2–3 evocative traits (adjectives like “curious”, “radiant”, “melancholic”)
- a harmonious 3–5 color palette (hex codes)
- a motion style (“swaying”, “darting”, “floating”, etc.)
- growth attributes (branching, curl, pulse, each 0.0–1.0)

Interpret the user’s answers metaphorically. For example:
- Choosing “Star”, “Bell”, or “Floating” suggests a “cloud” spirit.
- Choosing “Roots”, “Moss”, or “Growing” suggests a “plant”.
- Choosing “Bell”, “Animal sound”, or “Running” suggests an “animal”.

Answers:
${answers.map(a => `- ${a.question}: ${a.answer}`).join("\n")}

Return ONLY valid JSON matching this schema:
{
  "archetype": "plant" | "animal" | "cloud",
  "traits": ["...", "..."],
  "colorPalette": ["#xxxxxx", "#xxxxxx", "#xxxxxx"],
  "motionStyle": "...",
  "growth": {"branching":0.0,"curl":0.0,"pulse":0.0}
}
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
