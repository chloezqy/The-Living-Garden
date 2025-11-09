import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { socket } from "../socket";
import { Spirit } from "../types";

const allQuestions = [
  { id: 1, question: "At twilight, do you feel more drawn to the...", choices: ["First Star", "Last Light"] },
  { id: 2, question: "A hidden path appears. Is it made of...", choices: ["Mossy Stones", "Winding Roots"] },
  { id: 3, question: "You hear a sound. Is it...", choices: ["A Distant Bell", "A Soft Hum"] },
  { id: 4, question: "In a dream, you are...", choices: ["Floating", "Growing"] },
  { id: 5, question: "The wind whispers a secret. It feels...", choices: ["Cool and Sharp", "Warm and Gentle"] },
  { id: 6, question: "Your reflection ripples. It turns into...", choices: ["A Bird Taking Flight", "A Tree in Bloom"] },
  { id: 7, question: "The ground glows faintly. You step on...", choices: ["Fallen Stars", "Dewy Grass"] },
  { id: 8, question: "Someone calls your name. You answer with...", choices: ["A Song", "A Smile"] },
  { id: 9, question: "A raindrop lands on your hand. It feels like...", choices: ["Memory", "Promise"] },
  { id: 10, question: "When you close your eyes, you see...", choices: ["An Ocean", "A Garden"] },
];

// archetype pool
const archetypes = ["plant", "animal", "cloud"] as const;

const Quiz: React.FC = () => {
  const [quizQuestions, setQuizQuestions] = useState<typeof allQuestions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 随机抽取 3 道题目
  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    setQuizQuestions(shuffled.slice(0, 3));
  }, []);

  const handleAnswer = (answer: string) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    setAnswers([...answers, { question: currentQuestion.question, answer }]);
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  useEffect(() => {
    if (answers.length === quizQuestions.length && quizQuestions.length > 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers]);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const randomArchetype =
        archetypes[Math.floor(Math.random() * archetypes.length)];

      const randomTraits = ["gentle", "curious", "radiant", "bold", "soft", "dreamy", "playful", "resilient", "quiet", "bright"];
      const shuffledTraits = randomTraits.sort(() => 0.5 - Math.random()).slice(0, 2);

      const randomPalette = ["#A8DADC", "#457B9D", "#1D3557", "#F1FAEE", "#E63946", "#FFC8DD", "#CDB4DB", "#BDE0FE"];
      const chosenColors = randomPalette.sort(() => 0.5 - Math.random()).slice(0, 3);

      const spiritId = localStorage.getItem("spiritId") || uuidv4();
      localStorage.setItem("spiritId", spiritId);

      const newSpirit: Spirit = {
        id: spiritId,
        archetype: randomArchetype,
        traits: shuffledTraits,
        colorPalette: chosenColors,
        motionStyle: "still",
        growth: {
          branching: Math.random(),
          curl: Math.random(),
          pulse: Math.random(),
        },
        activityState: "active",
      };

      localStorage.setItem("spiritProfile", JSON.stringify(newSpirit));

      socket.connect();
      socket.emit("spirit:upsert", newSpirit);

      navigate("/garden");
    } catch (error) {
      console.error("Failed to process quiz:", error);
      setIsLoading(false);
    }
  };

  if (isLoading || quizQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400 mb-6"></div>
        <h1 className="text-3xl font-serif text-teal-200 mb-2">
          Awakening Your Spirit...
        </h1>
        <p className="text-lg text-slate-400">
          Growing from imagination and chance...
        </p>
      </div>
    );
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 font-serif">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-2xl md:text-4xl text-slate-300 mb-8">
          {currentQuestion.question}
        </h1>
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
            style={{
              width: `${progress}%`,
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;