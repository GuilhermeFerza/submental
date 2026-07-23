import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Releases } from './pages/Releases';
import { Events } from './pages/Events';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Admin } from './pages/Admin';


export default function App() {
    return (
        <>
            <ToastContainer theme="dark" />
            <Router>
                <Routes>
                    <Route path="*" element={<Home />} />
                    <Route path="/releases" element={<Releases />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/admin" element={<Login />}/>
                    <Route path="/admin/dashboard" element={<Admin />}/>
                </Routes>
            </Router>
        </>
        
    );
}