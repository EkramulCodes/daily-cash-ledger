import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header({ showNav = true }) {
  const location = useLocation();
  const [usd, setUsd] = useState('');
  const [rate, setRate] = useState(122);
  const [bdt, setBdt] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode');
  };

  const convert = (usdVal) => {
    const value = parseFloat(usdVal) || 0;
    setBdt(value * rate);
  };

  return (
    <header className="no-print">
      <div className="brand">
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="EME AIR INTERNATIONAL" className="brand-logo" />
        </Link>
      </div>
      {showNav && (
<nav className="ledger-tabs">
<Link to="/" className={`tab-btn btn btn-primary ${location.pathname === '/' ? 'active' : ''}`}>💰 Cash Ledger</Link>
<Link to="/client" className={`tab-btn btn btn-primary ${location.pathname === '/client' ? 'active' : ''}`}>👥 Client Ledger</Link>
<Link to="/salary" className={`tab-btn btn btn-primary ${location.pathname === '/salary' ? 'active' : ''}`}>💼 Salary Ledger</Link>
        </nav>
      )}
      <div className="tools-top">
        <button className="btn-icon" onClick={toggleTheme}>{isDark ? '☀️' : '🌙'}</button>
        <div className="converter-mini">
          <span>USD:</span>
          <input 
            type="number" 
            value={usd} 
            onChange={(e) => {
              setUsd(e.target.value);
              convert(e.target.value);
            }} 
            placeholder="0" 
            min="0"
          />
          <span>× {rate}</span>
          <strong>৳{bdt.toLocaleString()}</strong>
        </div>
      </div>
    </header>
  );
}

