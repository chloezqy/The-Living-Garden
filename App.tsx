
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Quiz from './pages/Quiz';
import Garden from './pages/Garden';

const App: React.FC = () => {
  // Check if a spirit profile exists to decide the initial route
  const hasSpiritProfile = !!localStorage.getItem('spiritProfile');

  return (
    <HashRouter>
      <Routes>
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/garden" element={<Garden />} />
        <Route 
          path="/" 
          element={hasSpiritProfile ? <Navigate to="/garden" /> : <Navigate to="/quiz" />} 
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
