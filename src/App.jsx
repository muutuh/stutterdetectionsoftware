import Landing from './components/Landing';
import UserOnboarding from './components/UserOnboarding';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Learning from './components/Learning';
import Assessment from './components/Assessment';
import Dashboard from './components/Dashboard';
import ExerciseModal from './components/ExerciseModal';
import Statistics from './components/Statistics';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Settings from './components/Settings';
import './index.css';
import { useSettings } from './context/SettingsContext';
import { useProgress } from './hooks/useProgress';

const todayStr = () => new Date().toISOString().slice(0, 10);

const BASE_CARDS = [
  { id: 1,  title: 'Free Speech',            description: 'Talk freely for up to 2 minutes',            xp: 50, icon: '💬' },
  { id: 2,  title: 'Reading',                description: 'Read an AI-generated passage aloud',          xp: 30, icon: '📖' },
  { id: 4,  title: 'Turtle Pace',            description: 'Slow down and feel each word',               xp: 50, icon: '🐢' },
  { id: 6,  title: 'Breath-to-Speech Reset', description: 'Reset tension and start speech on the exhale', xp: 40, icon: '🌬️' },
  { id: 9,  title: 'Phrase Practice',        description: 'Build fluent phrases',                       xp: 55, icon: '🗣️' },
  { id: 10, title: 'Q&A Pairs',              description: 'Answer AI-generated questions aloud',        xp: 45, icon: '🎤' },
  { id: 11, title: 'Tongue Twister',         description: 'Practice tricky AI-generated tongue twisters', xp: 35, icon: '👅' },
];

function loadDailyCards(completedToday) {
  return BASE_CARDS.map(card => ({
    ...card,
    completed: completedToday.includes(card.id),
  }));
}

function App() {
  const { settings } = useSettings();
  const { xpToday, completedToday, improvementPct, addXP, progress } = useProgress();

  const [currentView, setCurrentView] = useState('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [practiceCards, setPracticeCards] = useState(() => loadDailyCards([]));

  // Sync card completion with persisted progress on mount / when completedToday changes
  useEffect(() => {
    setPracticeCards(loadDailyCards(completedToday));
  }, [completedToday.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const [onboardingStatus, setOnboardingStatus] = useState(
    () => localStorage.getItem('onboardingStatus') || 'not_started'
  );

  useEffect(() => {
    if (isAuthenticated && onboardingStatus !== 'completed' && onboardingStatus !== 'skipped') {
      setCurrentView('user_onboarding');
    }
  }, [isAuthenticated, onboardingStatus]);

  const handleLandingStart = () => setCurrentView('login');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleCardClick = (card) => setSelectedExercise(card);

  const handleExerciseClose = (completed, xp = 0) => {
    if (completed && selectedExercise) {
      addXP(xp, selectedExercise.id);

      const updatedCards = practiceCards.map(card =>
        card.id === selectedExercise.id ? { ...card, completed: true } : card
      );
      setPracticeCards(updatedCards);

      if (settings.practice_auto_advance) {
        const next =
          updatedCards.find(c => !c.completed && c.id > selectedExercise.id) ||
          updatedCards.find(c => !c.completed);
        if (next) {
          setTimeout(() => setSelectedExercise(next), 500);
          return;
        }
      }
    }
    setSelectedExercise(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('landing');
  };

  const handleTabChange = (tabId) => setCurrentView(tabId);

  const rerunTour = () => {
    setOnboardingStatus('not_started');
    localStorage.setItem('onboardingStatus', 'not_started');
    setCurrentView('user_onboarding');
  };

  const dailyTargetXP = settings.practice_daily_minutes * 10;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {isAuthenticated && ['dashboard', 'learning', 'assessment', 'statistics', 'settings'].includes(currentView) && (
        <Navbar
          activeTab={currentView}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
          onRerunTour={rerunTour}
        />
      )}

      <div className="flex-1 mx-auto w-full max-w-[1600px] px-6 2xl:max-w-[1800px] 2xl:px-8">
        {currentView === 'landing' && <Landing onStart={handleLandingStart} />}

        {currentView === 'user_onboarding' && (
          <UserOnboarding
            status={onboardingStatus}
            setStatus={(s) => { setOnboardingStatus(s); localStorage.setItem('onboardingStatus', s); }}
            onComplete={() => { setOnboardingStatus('completed'); localStorage.setItem('onboardingStatus', 'completed'); setCurrentView('dashboard'); }}
            onSkip={() => { setOnboardingStatus('skipped'); localStorage.setItem('onboardingStatus', 'skipped'); setCurrentView('dashboard'); }}
            practiceCards={practiceCards}
            onCardClick={handleCardClick}
            selectedExercise={selectedExercise}
          />
        )}

        {currentView === 'login' && (
          <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />
        )}

        {currentView === 'register' && (
          <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentView('login')} />
        )}

        {currentView === 'learning' && isAuthenticated && (
          <Learning onComplete={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'assessment' && isAuthenticated && (
          <Assessment onComplete={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'dashboard' && isAuthenticated && (
          <Dashboard
            onCardClick={handleCardClick}
            practiceCards={practiceCards}
            xpToday={xpToday}
            dailyTargetXP={dailyTargetXP}
            streak={progress.streak}
            improvementPct={improvementPct}
          />
        )}

        {currentView === 'statistics' && isAuthenticated && (
          <Statistics progress={progress} xpToday={xpToday} improvementPct={improvementPct} />
        )}

        {currentView === 'settings' && isAuthenticated && (
          <Settings onRerunTour={rerunTour} />
        )}

        {selectedExercise && (
          <ExerciseModal
            exercise={selectedExercise}
            onClose={handleExerciseClose}
            showTips={settings.practice_show_tips}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
