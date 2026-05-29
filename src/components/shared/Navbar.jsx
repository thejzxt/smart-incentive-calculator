import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const [isDark, setIsDark] = useState(() => {
    try {
      const saved = window.localStorage.getItem("toyota_theme");
      if (saved) return saved === "dark";

      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  });


  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      try {
        window.localStorage.setItem("toyota_theme", "dark");
      } catch { }
    } else {
      root.classList.remove("dark");
      try {
        window.localStorage.setItem("toyota_theme", "light");
      } catch { }
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-toyota-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="bg-toyota-red text-white px-2.5 py-0.5 rounded-sm text-sm font-black tracking-wider transition-transform group-hover:scale-105">
                T
              </span>
              <span className="text-lg font-black tracking-widest text-toyota-dark dark:text-white transition-colors">
                TOYOTA
              </span>
              <span className="hidden sm:inline-block h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2" />
              <span className="hidden sm:inline-block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Incentive Portal
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-toyota-red dark:hover:text-toyota-red hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle theme mode"
            >
              {isDark ? (

                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707-.707m12.728 0l-.707.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072 0l-7.072 7.072z" />
                </svg>
              ) : (

                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">

                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {user.username}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.25 rounded-md ${user.role === 'admin'
                      ? 'bg-red-50 text-toyota-red border border-red-200 dark:bg-red-950/20 dark:border-red-900/50'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/50'
                    }`}>
                    {user.role}
                  </span>
                </div>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />


                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-toyota-red dark:hover:text-toyota-red transition-all active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
