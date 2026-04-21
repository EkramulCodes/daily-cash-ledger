import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useLayoutEffect } from 'react';
import Layout from './components/layout/Layout';
import MainLedger from './pages/MainLedger';
import ClientLedger from './pages/ClientLedger';
import SalaryLedger from './pages/SalaryLedger';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<MainLedger />} />
      <Route path="/client" element={<ClientLedger />} />
      <Route path="/salary" element={<SalaryLedger />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;

