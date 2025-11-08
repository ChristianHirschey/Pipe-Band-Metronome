import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import About from './About';
import ThemeToggle from './ThemeToggle';
import './App.css';

function App() {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('theme') || 'light';
        } catch (e) {
            return 'light';
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
        try { localStorage.setItem('theme', theme); } catch (e) {}
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    return (
        <div className="App">
            <ThemeToggle theme={theme} toggle={toggleTheme} />
            <Router basename="/Pipe-Band-Metronome">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
