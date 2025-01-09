import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import MainPage from './pages/MainPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AuthPage />} />
                <Route path="/mainPage" element={<MainPage />} />
            </Routes>
        </Router>
    );
};

export default App;
