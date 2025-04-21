import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './components/WelcomePage'
import { IdPage } from './components/IdPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/id" element={<IdPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
