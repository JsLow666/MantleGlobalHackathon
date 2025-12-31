import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NotificationToast from './components/common/NotificationToast';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Submit from './pages/Submit';
import NewsDetail from './pages/NewsDetail';
import About from './pages/About';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Performance from './pages/Performance';
import Governance from './pages/Governance';

function AppContent() {
  const location = useLocation();
  const isLandingOrAuth = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLandingOrAuth && <Header />}
      <main className={isLandingOrAuth ? '' : 'container mx-auto px-4 py-8'}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </main>
      {!isLandingOrAuth && <Footer />}
      <NotificationToast />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <WalletProvider>
        <Router>
          <AppContent />
        </Router>
      </WalletProvider>
    </NotificationProvider>
  );
}

export default App;