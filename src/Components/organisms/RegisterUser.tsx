import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useContext, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { AuthContext } from "./AuthContext";

const RegisterUser: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      interface UserResponse {
        _id: string;
        name: string;
        email: string;
        role: "normal" | "HR" | "manager" | "SuperAdmin";
      }

      const { data } = await axiosInstance.post<UserResponse>(
        `${backendUrl}api/users/register`,
        { name, email, password },
        config
      );

      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });

      navigate("/login");
    } catch (error: any) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : "Registration failed. Please try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
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

      {/* Left Section - Branding & Benefits */}
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
            Join the
            <br />
            <span className="bg-gradient-to-r from-platinum-300 via-alabaster-grey-300 to-slate-grey-300 bg-clip-text text-transparent">
              Next Generation
            </span>
          </h2>
          <p className="text-lg text-slate-grey-300 max-w-md leading-relaxed">
            Create your account and access enterprise-grade workforce management
            tools.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 text-xs text-slate-grey-400">
          <p>© 2025 Nexus Corp.</p>
        </div>
      </section>

      {/* Right Section - Registration Form */}
      <section className="flex w-full lg:w-3/5 items-center justify-center p-6 md:p-12 z-10 overflow-y-auto">
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

          {/* Registration Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-slate-grey-300 text-sm">
                Start your enterprise journey today
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Name Input */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-grey-200"
                >
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="w-5 h-5 text-slate-grey-400 group-focus-within:text-platinum-300 transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-platinum-400/50 focus:border-platinum-400/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-grey-200"
                >
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="w-5 h-5 text-slate-grey-400 group-focus-within:text-platinum-300 transition-colors" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-platinum-400/50 focus:border-platinum-400/50 transition-all"
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-grey-200"
                >
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="w-5 h-5 text-slate-grey-400 group-focus-within:text-platinum-300 transition-colors" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-platinum-400/50 focus:border-platinum-400/50 transition-all"
                    placeholder="Minimum 6 characters"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-slate-grey-200"
                >
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="w-5 h-5 text-slate-grey-400 group-focus-within:text-platinum-300 transition-colors" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-grey-400 focus:outline-none focus:ring-2 focus:ring-platinum-400/50 focus:border-platinum-400/50 transition-all"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* Terms Agreement */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 mt-0.5 rounded border-white/10 bg-white/5 text-platinum-400 focus:ring-2 focus:ring-platinum-400/50"
                />
                <label htmlFor="terms" className="text-xs text-slate-grey-300">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-platinum-300 hover:text-platinum-200 transition-colors"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-platinum-300 hover:text-platinum-200 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-platinum-400 to-slate-grey-400 text-gunmetal-950 rounded-xl font-semibold text-base shadow-lg hover:shadow-platinum-400/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
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
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FiArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-slate-grey-300">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-platinum-300 hover:text-platinum-200 font-semibold transition-colors inline-flex items-center gap-1"
                >
                  Sign In
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </p>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-grey-400">
              Need assistance?{" "}
              <a
                href="#"
                className="text-platinum-300 hover:text-platinum-200 font-medium transition-colors"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterUser;
