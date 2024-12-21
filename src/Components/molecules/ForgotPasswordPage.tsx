import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import logo from "../../assets/logo.png";
import forgotPasswordImg from "../../assets/forgot-password-img.png";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/users/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        response.data.message || "Password reset link sent to your email"
      );

      navigate("/signin");
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen bg-gray-50 overflow-hidden">
      <section className="flex flex-col justify-center w-full lg:w-1/2 px-6 md:px-12 bg-white">
        <div className="mb-10 text-center">
          <img
            loading="lazy"
            src={logo}
            alt="Company Logo"
            className="mx-auto mt-4 w-64 md:w-80 h-auto"
          />
        </div>

        <form
          className="flex flex-col space-y-6 max-w-[auto] w-full md:w-[400px] mx-auto"
          onSubmit={handleForgotPassword}
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Forgot Password
          </h2>

          <p className="text-center text-gray-600 mb-4">
            Enter the email address associated with your account. We'll send you
            a link to reset your password.
          </p>

          <div className="flex flex-col">
            <label
              htmlFor="emailInput"
              className="text-start text-base font-medium text-black mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="emailInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-3 py-3 text-base font-medium text-zinc-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Email"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full px-3 py-3 mt-4 text-lg font-medium text-white bg-[#662D91] rounded-lg hover:bg-purple-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="w-6 h-6 text-white animate-spin mx-auto"
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
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:underline"
              onClick={() => navigate("/signin")}
            >
              Back to Sign In
            </button>
          </div>
        </form>
      </section>

      <section className="hidden lg:flex items-center justify-center w-1/2">
        <img
          src={forgotPasswordImg}
          alt="Forgot Password Illustration"
          className="object-contain w-full h-full"
        />
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
