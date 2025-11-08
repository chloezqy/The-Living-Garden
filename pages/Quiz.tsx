
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { generateSpiritProfile } from '../services/AIService';
import { socket } from '../socket';
import { Spirit } from '../types';

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
      const spiritProfileData = await generateSpiritProfile(answers);
      
      const spiritId = localStorage.getItem('spiritId') || uuidv4();
      localStorage.setItem('spiritId', spiritId);
      
      const newSpirit: Spirit = {
        id: spiritId,
        ...spiritProfileData,
        activityState: 'active',
      };
      
      localStorage.setItem('spiritProfile', JSON.stringify(newSpirit));
      
      socket.connect();
      socket.emit('spirit:upsert', newSpirit);
      
      navigate('/garden');

    } catch (error) {
      console.error("Failed to process quiz and generate spirit:", error);
      setIsLoading(false);
      // Maybe show an error message to the user
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
                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
            </div>
        </div>
    </div>
  );
};

export default Quiz;
