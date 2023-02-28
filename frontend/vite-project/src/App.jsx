import { Route, Routes, Link } from 'react-router-dom'
import { Home } from './pages/Home'
import { Check } from './pages/Check'
import './App.css'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/check" element={<Check />}/>
      </Routes>
    </div>
  )
}

export default App
