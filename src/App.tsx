import { HashRouter, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './components/WelcomePage'
import { IdPage } from './components/IdPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/id" element={<IdPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
