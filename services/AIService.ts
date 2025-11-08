export interface Answer {
  question: string;
  answer: string;
}

export interface Spirit {
  archetype: "plant" | "animal" | "cloud";
  traits: string[];
  colorPalette: string[];
  motionStyle: string;
  growth: { branching: number; curl: number; pulse: number };
}

export const generateSpiritProfile = async (
  answers: Answer[]
): Promise<Spirit> => {
  try {
    const res = await fetch("http://localhost:3001/api/spirit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });

    if (!res.ok) {
      throw new Error(`Backend returned ${res.status}`);
    }

    const data = await res.json();
    return data as Spirit;
  } catch (err) {
    console.error("❌ Failed to generate spirit:", err);
    // fallback: simple default
    return {
      archetype: "plant",
      traits: ["resilient", "calm"],
      colorPalette: ["#A8DADC", "#457B9D", "#1D3557"],
      motionStyle: "swaying",
      growth: { branching: 0.5, curl: 0.5, pulse: 0.5 },
    };
  }
};