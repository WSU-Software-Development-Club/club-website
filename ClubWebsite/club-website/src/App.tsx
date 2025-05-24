import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Team from './pages/Team';
import About from './pages/About';
import Projects from './pages/Projects';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/team' element={<Team />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
      </Routes>
    </Router>
  );
}