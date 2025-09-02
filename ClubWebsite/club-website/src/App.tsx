import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Team from './pages/Team';
import About from './pages/About';
import Projects from './pages/Projects';
import Events from './pages/Events';
import JoinUs from './pages/JoinUs';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/team' element={<Team />} />
        <Route path='/about' element={<About />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/events' element={<Events />} />
        <Route path='/join us' element={<JoinUs />} />
      </Routes>
    </Router>
  );
}