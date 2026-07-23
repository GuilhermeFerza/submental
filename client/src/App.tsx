import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Releases } from './pages/Releases';
import { Events } from './pages/Events';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="*" element={<Home />} />
                <Route path="/releases" element={<Releases />} />
                <Route path="/events" element={<Events />} />
            </Routes>
        </Router>
    );
}