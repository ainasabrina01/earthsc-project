import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { WelcomePage } from './components/WelcomePage'
import { IdPage } from './components/IdPage'
import { IntroStoryPage } from './components/IntroStoryPage'
import { Room1 } from './components/Room1'
import { Room2 } from './components/Room2'
import { Room3 } from './components/Room3'
import { ExitPage } from './components/ExitPage'
import { ReferencePage } from './components/ReferencePage'
import { GameProvider } from './components/GameContext'
import { ProtectedRoute } from './components/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="" element={<WelcomePage />} />
      <Route path="/profile" element={<IdPage />} />
      <Route path="/intro" element={<IntroStoryPage />} />
      <Route path="/room1" element={<Room1 />} />
      <Route path="/room2" element={
        <ProtectedRoute element={<Room2 />} room="room2" />
      } />
      <Route path="/room3" element={
        <ProtectedRoute element={<Room3 />} room="room3" />
      } />
      <Route path="/exit" element={
        <ProtectedRoute element={<ExitPage />} room="exit" />
      } />
      <Route path="/reference" element={<ReferencePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </HashRouter>
  )
}

export default App
