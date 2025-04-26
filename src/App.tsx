import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//Layout Components
import Header from './components/PageLayout/Header/Header';
import Footer from './components/PageLayout/Footer/Footer';

//Core Pages
import MainPage from './components/PageLayout/MainPage/MainPage';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Ressources from './pages/Ressources';
import ChangeLogs from './pages/ChangeLogs';
import Upcoming from './pages/Upcoming';

const App: React.FC = () => {
  //Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  //Currently, selected bookmark (used for loading existing saved states)
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  //On mount, load token and email from localStorage, if available
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('userEmail');

    if (savedToken && savedEmail) {
      setIsLoggedIn(true);
      setToken(savedToken);
      setUserEmail(savedEmail);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Global header with auth and bookmark state */}
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setToken={setToken}
          setUserEmail={setUserEmail}
          userEmail={userEmail}
          token={token}
          setSelectedBookmark={setSelectedBookmark}
        />

        {/* Routes for core pages */}
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                isLoggedIn={isLoggedIn}
                token={token}
                userEmail={userEmail}
                selectedBookmark={selectedBookmark}
              />
            }
          />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/ressources" element={<Ressources />} />
          <Route path="/changelogs" element={<ChangeLogs />} />
          <Route path="/upcoming" element={<Upcoming />} />
        </Routes>

        {/* Global footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
