// client/src/componenets/Header.jsx
import { FaSearch, FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'sv' ? 'en' : 'sv';
    i18n.changeLanguage(nextLang);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="HomeIQ logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-2 rounded-lg flex items-center border border-slate-400"
        >
          <input
            type="text"
            placeholder={t('searchPlaceholder') || 'Search...'}
            className="bg-transparent focus:outline-none w-20 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FaSearch className="text-slate-500" />
          </button>
        </form>

        {/* Desktop Navigation */}
        <ul className="hidden sm:flex items-center gap-4">
          <Link to="/"><li className="text-slate-700 hover:underline">Home</li></Link>
          <Link to="/about"><li className="text-slate-700 hover:underline">About</li></Link>
          <Link to="/profile">
            {currentUser ? (
              <img src={currentUser.avatar} alt="profile" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <li className="text-slate-700 hover:underline">Sign In</li>
            )}
          </Link>
          <li
            onClick={toggleLanguage}
            className="cursor-pointer flex items-center gap-1 text-slate-700 hover:text-slate-900"
            title="Byt språk"
          >
            <span className="text-xs font-medium">{i18n.language.toUpperCase()}</span>
            <FaGlobe className="text-lg" />
          </li>
        </ul>

        {/* Mobile: Right side icons */}
        <div className="flex sm:hidden items-center gap-3">
          <Link to="/profile">
            {currentUser ? (
              <img src={currentUser.avatar} alt="profile" className="w-8 h-8 rounded-full object-cover" />
            ) : null}
          </Link>
          <div
            onClick={toggleLanguage}
            className="cursor-pointer flex items-center gap-1 text-slate-700 hover:text-slate-900"
            title="Byt språk"
          >
            <span className="text-xs font-medium">{i18n.language.toUpperCase()}</span>
            <FaGlobe className="text-lg" />
          </div>

          {/* Hamburger Icon */}
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <FaTimes className="text-xl text-slate-700" />
            ) : (
              <FaBars className="text-xl text-slate-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden bg-slate-100 px-4 overflow-hidden transition-all duration-300 transform origin-top ${
          menuOpen ? 'scale-y-100 opacity-100 max-h-96' : 'scale-y-0 opacity-0 max-h-0 pointer-events-none'
        }`}
      >
        <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-700 hover:underline">
          Home
        </Link>
        <Link to="/about" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-700 hover:underline">
          About
        </Link>
        {!currentUser && (
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="block py-2 text-slate-700 hover:underline">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
