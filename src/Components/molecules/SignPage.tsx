import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FiMail, FiLock } from "react-icons/fi";
import { AuthContext } from "../organisms/AuthContext";

const SiginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { fetchUserProfile, setUser } = useContext(AuthContext);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/users/auth`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const userData = await fetchUserProfile();
        if (userData) {
          navigate("/dashboard");
        } else {
          setErrorMessage("Unable to fetch user profile");
        }
      }
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-gradient-to-br from-gunmetal-950 via-carbon-black-900 to-gunmetal-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-platinum-400/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-grey-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-iron-grey-400/3 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      {/* Left Section - Branding & Info */}
      <section className="hidden lg:flex lg:w-2/5 relative flex-col justify-center p-12 xl:p-16 z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-platinum-400 to-slate-grey-400 rounded-xl flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-display font-bold text-gunmetal-950">
              N
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              NEXUS<span className="text-platinum-400">HRM</span>
            </h1>
            <p className="text-[10px] text-slate-grey-400 uppercase tracking-[0.2em] mt-0.5">
              Enterprise Suite
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h2 className="text-5xl xl:text-6xl font-display font-bold text-white leading-tight">
            Welcome to the
            <br />
            <span className="bg-gradient-to-r from-platinum-300 via-alabaster-grey-300 to-slate-grey-300 bg-clip-text text-transparent">
              Future of Work
            </span>
          </h2>
          <p className="text-lg text-slate-grey-300 max-w-md leading-relaxed">
            Streamline your workforce management with enterprise solutions.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-slate-grey-400">
          <p>© 2025 Nexus Corp.</p>
        </div>
      </section>

      {/* Right Section - Login Form */}
      <section className="flex w-full lg:w-3/5 items-center justify-center p-6 md:p-12 z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-platinum-400 to-slate-grey-400 rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-xl font-display font-bold text-gunmetal-950">
                N
              </span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-white tracking-tight">
                NEXUS<span className="text-platinum-400">HRM</span>
              </h1>
              <p className="text-[9px] text-slate-grey-400 uppercase tracking-[0.2em]">
                Enterprise Suite
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                Sign In
              </h2>
              <p className="text-slate-grey-300 text-sm">
                Access your enterprise workspace
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSignIn}>
              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="emailInput"
                  className="block text-sm font-medium text-slate-grey-200"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="w-5 h-5 text-slate-grey-400 group-focus-within:text-platinum-300 transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="emailInput"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-platinum-400/50 focus:border-platinum-400/50 transition-all"
                    placeholder="your.email@company.com"
                    aria-label="Email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="passwordInput"
                  className="block text-sm font-medium text-slate-grey-200"
                >
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="w-5 h-5 text-slate-grey-400 group-focus-within:text-platinum-300 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="passwordInput"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-platinum-400/50 focus:border-platinum-400/50 transition-all"
                    placeholder="Enter your password"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-grey-400 hover:text-platinum-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={20} />
                    ) : (
                      <AiFillEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-platinum-400 to-slate-grey-400 text-gunmetal-950 rounded-xl font-semibold text-base shadow-lg hover:shadow-platinum-400/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Additional Links */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-platinum-400 focus:ring-2 focus:ring-platinum-400/50"
                  />
                  <span className="text-sm text-slate-grey-300 group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-platinum-300 hover:text-platinum-200 transition-colors font-medium"
                  onClick={() => {}}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SiginPage;
