// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./i18n";
// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import Contact from "./pages/Contact";
import PremiumPage from "./pages/PremiumPage";
import Parent from "./pages/parent";
import ELearning from "./pages/elearning";
import Materials from "./pages/Materials";
import TamilComputingHistory from "./pages/TamilComputingHistory"

// Level pages
import Level1 from "./pages/Level1";
import Level2 from "./pages/Level2";
import Level3 from "./pages/Level3";
import Level4 from "./pages/Level4";
import FinalTest from "./pages/FinalTest";

// Level 1 games
import FlashTag from "./pages/games/FlashTag";
import MatchLetter from "./pages/games/matchletter";
import DragDrop from "./pages/games/DragDrop";
import FlipFlop from "./pages/games/flipflop";

// Level 2 games
import RepeatWords from "./pages/games/wordsrepeat";
import MatchWord from "./pages/games/matchword";
import WordQuest from "./pages/games/wordquest"
import Rapidfire from "./pages/games/rapid-fire"

// Level 3 games
import WordNinja from "./pages/games/WordNinja";
import SentenceShuffler from "./pages/games/SentenceShuffler";
import LightningWords from "./pages/lightning-words";
import SpeedShots from "./pages/games/speed-shots";

// Level 4 games
import Para from "./pages/Para"; // Corrected import
import StoryBuilder from "./pages/games/StoryBuilder";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  // Track unlocked levels, initially only level 1 unlocked
  const [unlockedLevels, setUnlockedLevels] = useState([1]);

  // Function to unlock the next level after completing current
  const unlockNextLevel = (currentLevel) => {
    if (!unlockedLevels.includes(currentLevel + 1)) {
      setUnlockedLevels([...unlockedLevels, currentLevel + 1]);
    }
  };

  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard unlockedLevels={unlockedLevels} />
          </ProtectedRoute>
        }
      />

      {/* Other Pages */}
      <Route path="/contact" element={<Contact />} />
      <Route
        path="/premium"
        element={
          <ProtectedRoute>
            <PremiumPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent"
        element={
          <ProtectedRoute>
            <Parent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/elearning"
        element={
          <ProtectedRoute>
            <ELearning />
          </ProtectedRoute>
        }
      />

      {/* Level Pages */}
      <Route
        path="/level1"
        element={
          <ProtectedRoute>
            <Level1 unlockNextLevel={unlockNextLevel} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level2"
        element={
          <ProtectedRoute>
            <Level2 unlockNextLevel={unlockNextLevel} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level3"
        element={
          <ProtectedRoute>
            <Level3 unlockNextLevel={unlockNextLevel} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/level4"
        element={
          <ProtectedRoute>
            <Level4 unlockNextLevel={unlockNextLevel} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/final-test"
        element={
          <ProtectedRoute>
            <FinalTest unlockNextLevel={unlockNextLevel} />
          </ProtectedRoute>
        }
      />

      {/* Level 1 Games */}
      <Route
        path="/flash-tag"
        element={
          <ProtectedRoute>
            <FlashTag />
          </ProtectedRoute>
        }
      />
      <Route
        path="/match-letter"
        element={
          <ProtectedRoute>
            <MatchLetter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/drag-drop"
        element={
          <ProtectedRoute>
            <DragDrop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/flipflop"
        element={
          <ProtectedRoute>
            <FlipFlop />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wordsrepeat"
        element={
          <ProtectedRoute>
            <RepeatWords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/matchword"
        element={
          <ProtectedRoute>
            <MatchWord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rapid-fire"
        element={
          <ProtectedRoute>
            <Rapidfire />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wordquest"
        element={
          <ProtectedRoute>
            <WordQuest />
          </ProtectedRoute>
        }
      />
      

      {/* Level 3 Games */}
      <Route
        path="/word-ninja"
        element={
          <ProtectedRoute>
            <WordNinja />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sentence-shuffler"
        element={
          <ProtectedRoute>
            <SentenceShuffler />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lightning-words"
        element={
          <ProtectedRoute>
            <LightningWords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/speed-shots"
        element={
          <ProtectedRoute>
            <SpeedShots />
          </ProtectedRoute>
        }
      />

      {/* Level 4 Games */}
      <Route
        path="/Para"
        element={
          <ProtectedRoute>
            <Para />
          </ProtectedRoute>
        }
      />
      <Route
        path="/StoryBuilder"
        element={
          <ProtectedRoute>
            <StoryBuilder />
          </ProtectedRoute>
        }
      />

      {/* Assistant / Chatbot */}
      <Route
        path="/assistant"
        element={
          <ProtectedRoute>
            <Assistant />
          </ProtectedRoute>
        }
      />
      <Route
  path="/history-tamil-computing"
  element={
    <ProtectedRoute>
      <TamilComputingHistory />
    </ProtectedRoute>
  }
/>
<Route
  path="/Materials"
  element={
    <ProtectedRoute>
      <Materials />
    </ProtectedRoute>
  }
/>



      {/* Redirect old /dashboard route → home */}
      <Route path="/dashboard" element={<Navigate to="/" />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
