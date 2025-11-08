import React, { useState, useEffect } from "react";
import { Spirit, Archetype } from "../types";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../socket";

const quizQuestions = [
  { id: 1, question: "At twilight, do you feel more drawn to the...", choices: ["First Star", "Last Light"] },
  { id: 2, question: "A hidden path appears. Is it made of...", choices: ["Mossy Stones", "Winding Roots"] },
  { id: 3, question: "You hear a sound. Is it...", choices: ["A Distant Bell", "A Soft Hum"] },
  { id: 4, question: "In a dream, you are...", choices: ["Floating", "Growing"] },
];

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (answer: string) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    setAnswers([...answers, { question: currentQuestion.question, answer }]);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  useEffect(() => {
    if (answers.length === quizQuestions.length) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // 🌿 Randomly generate Spirit data
      const archetypes: Archetype[] = ["plant", "animal", "cloud"];
      const archetype: Archetype =
        archetypes[Math.floor(Math.random() * archetypes.length)];

      const possibleTraits = [
        "gentle", "curious", "radiant", "calm", "bold",
        "wistful", "resilient", "playful", "dreamy", "mysterious",
      ];
      const shuffled = possibleTraits.sort(() => 0.5 - Math.random());
      const traits = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));

      const colorPalettes = [
        ["#A8DADC", "#457B9D", "#1D3557"],
        ["#FADADD", "#FFB6B9", "#8AC6D1"],
        ["#C1FFD7", "#B5DEFF", "#CAB8FF"],
        ["#E9C46A", "#F4A261", "#E76F51"],
        ["#B9FBC0", "#98F5E1", "#8EECF5"],
      ];
      const colorPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

      const motionStyles = ["swaying", "floating", "darting"];
      const motionStyle = motionStyles[Math.floor(Math.random() * motionStyles.length)];

      const growth = {
        branching: Math.random(),
        curl: Math.random(),
        pulse: Math.random(),
      };

      // 🌿 Generate random position in screen range
      const x = window.innerWidth * (0.2 + Math.random() * 0.6);
      const y = window.innerHeight * (0.5 + Math.random() * 0.3);

      // 🌿 Unique ID and persistence
      const spiritId = localStorage.getItem("spiritId") || uuidv4();
      localStorage.setItem("spiritId", spiritId);

      const spirit: Spirit = {
        id: spiritId,
        archetype,
        traits,
        colorPalette,
        motionStyle,
        growth,
        activityState: "active",
        x,
        y,
        size: 40,
      };

      // Save locally
      localStorage.setItem("spiritProfile", JSON.stringify(spirit));

      // Sync to server (for multi-user view)
      socket.connect();
      socket.emit("spirit:upsert", spirit);

      navigate("/garden");
    } catch (err) {
      console.error("❌ Failed to generate spirit:", err);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400 mb-6"></div>
        <h1 className="text-3xl font-serif text-teal-200 mb-2">Awakening Your Spirit...</h1>
        <p className="text-lg text-slate-400">Drawing from starlight and soil...</p>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 font-serif">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-2xl md:text-4xl text-slate-300 mb-8">{currentQuestion.question}</h1>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {currentQuestion.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              className="w-full md:w-64 bg-slate-800 border border-slate-600 text-slate-200 px-8 py-4 rounded-lg text-xl hover:bg-teal-800 hover:border-teal-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 mt-12">
          <div
            className="bg-teal-500 h-1.5 rounded-full"
            style={{ width: `${progress}%`, transition: "width 0.5s ease-in-out" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;