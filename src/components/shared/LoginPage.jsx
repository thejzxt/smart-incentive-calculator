import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "officer") {
        navigate("/officer", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const u = username.trim();
    const p = password.trim();

    if (!u || !p) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);


    setTimeout(() => {
      const result = login(u, p);
      setLoading(false);
      if (!result.success) {
        setError("Invalid username or password. Please try again.");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-toyota-dark via-[#151515] to-toyota-dark flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md bg-toyota-charcoal/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/5 overflow-hidden transform transition-all animate-slide-up">

        <div className="h-1 bg-toyota-red w-full" />

        <div className="p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-widest text-white flex items-center justify-center gap-2">
              <span className="bg-toyota-red text-white px-2 py-0.5 rounded-sm text-lg font-black tracking-normal">T</span>
              TOYOTA
            </h1>
            <p className="text-gray-400 mt-2 text-xs uppercase tracking-widest font-semibold">
              Sales Incentive Portal
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label
                htmlFor="username-input"
                className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2"
              >
                Username
              </label>
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-800 bg-[#121212] text-white focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent transition-all duration-200 placeholder-gray-600 text-sm"
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>


            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-800 bg-[#121212] text-white focus:outline-none focus:ring-2 focus:ring-toyota-red focus:border-transparent transition-all duration-200 placeholder-gray-600 text-sm"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />


                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-toyota-red hover:bg-toyota-redHover disabled:bg-red-950/40 disabled:text-white/40 text-white font-bold rounded-lg shadow-lg hover:shadow-red-600/10 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>


            {error && (
              <div
                className="bg-rose-950/30 border border-rose-900/50 rounded-lg p-3 flex gap-2 items-center text-rose-400 text-xs animate-fade-in"
                role="alert"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
