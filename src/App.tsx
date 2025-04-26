import { HashRouter, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './components/WelcomePage'
import { IdPage } from './components/IdPage'
import { IntroStoryPage } from './components/IntroStoryPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="" element={<WelcomePage />} />
        <Route path="/profile" element={<IdPage />} />
        <Route path="/intro" element={<IntroStoryPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
