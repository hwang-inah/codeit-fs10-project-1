import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/UI/Header';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudyInsertionPage from './pages/StudyInsertionPage';
import StudyDetailTemplate from './template/StudyDetailTemplate';
import StudyInsertionTemplate from './template/StudyInsertionTemplate';
import TodayHabitPage from './pages/TodayHabitPage';
import TimerPage from './pages/TimerPage';
import useToast from './hooks/useToast';

function RouteGuard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showError } = useToast();

  useEffect(() => {
    const currentPath = location.pathname;
    const allowedPaths = ['/', '/enrollment'];
    const detailPathPattern = /^\/detail\/\d+$/;
    const insertionPathPattern = /^\/enrollment\/\d+$/;
    const todayHabitPathPattern = /^\/todayHabit\/\d+$/;
    const timerPathPattern = /^\/timer\/\d+$/;
    
    // Landing page에서 시작한 경우에만 체크 (session storage에 studyId가 있는 경우)
    const currentStudyId = sessionStorage.getItem('current_study_id');
    
    if (currentStudyId) {
      // detail page, insertion page, todayHabit, timer, landing page, enrollment page가 아닌 다른 페이지로 이동하려고 할 때
      if (!detailPathPattern.test(currentPath) && 
          !insertionPathPattern.test(currentPath) &&
          !todayHabitPathPattern.test(currentPath) &&
          !timerPathPattern.test(currentPath) &&
          !allowedPaths.includes(currentPath)) {
        showError('이동할 수 없는 페이지입니다.');
        navigate('/');
      }
    }
  }, [location.pathname, navigate, showError]);

  return null;
}

function App() {
  return (
    <>
      <RouteGuard />
      <div className="app container">
        <Header />
        <Routes>
          <Route path='/' element={<LandingPage />}/>
          <Route path='/enrollment' element={<StudyInsertionPage />}/>
          <Route path='/enrollment/:studyId' element={<StudyInsertionTemplate />}/>
          <Route path='/detail/:studyId' element={<StudyDetailTemplate />}/>
          <Route path='/todayHabit/:studyId' element={<TodayHabitPage />}/>
          <Route path='/timer/:studyId' element={<TimerPage />}/>
        </Routes>
      </div>
      
    </>
  )
}

export default App;
