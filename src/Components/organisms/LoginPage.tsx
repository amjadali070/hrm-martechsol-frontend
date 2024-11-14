// frontend/src/Components/organisms/SignInPage.tsx

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import LogIN from '../../assets/login-img.png';

const  LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
//   const { setUser } = useContext(AuthContext);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(
        `${backendUrl}/api/users/auth`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // Fetch user profile after successful login
        const profileResponse = await axios.get(`${backendUrl}/api/users/profile`, { withCredentials: true });
        // setUser(profileResponse.data); // Update Auth Context
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false); // Set loading to false after processing
    }
  };

  return (
    <>
      <main className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sign-In Form Section */}
        <section className="flex flex-col justify-center w-full lg:w-1/2 px-6 md:px-12 bg-white">
          <div className="mb-10 text-center">
            {/* <h1 className="text-3xl font-semibold">Welcome to</h1> */}
            {/* <img
              loading="lazy"
              src={logo}
              alt="Stormwave Marketing Logo"
              className="mx-auto mt-4 w-64 md:w-80 h-auto" /> */}
          </div>

          <form
            className="flex flex-col space-y-4 max-w-[auto] w-full md:w-[400px] mx-auto"
            onSubmit={handleSignIn}
          >
            <div className="flex flex-col">
              <label htmlFor="emailInput" className="text-start text-base font-medium text-black">
                Email
              </label>
              <input
                type="email"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-3 text-base font-medium text-zinc-600 border border-gray-300 rounded-lg focus:outline-none"
                aria-label="Email" />
            </div>

            <div className="flex flex-col">
              <label htmlFor="passwordInput" className="text-start text-base font-medium text-black">
                Password
              </label>
              <input
                type="password"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 text-base font-medium text-zinc-600 border border-gray-300 rounded-lg focus:outline-none"
                aria-label="Password" />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <button
              type="button"
              className="self-start mt-2 text-sm font-medium text-blue-600 hover:underline"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button>

            <button
              type="submit"
              className="w-full px-3 py-3 mt-6 text-lg font-medium text-white bg-[#662D91] rounded-lg"
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
                'Sign In'
              )}
            </button>
{/* 
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Register here
                </Link>
              </p>
            </div> */}
          </form>
        </section>

        <section className="hidden lg:flex items-center justify-center w-1/2">
          <img
            loading="lazy"
            src={LogIN}
            alt="Sign In Page Illustration"
            className="object-contain w-full h-auto" />
        </section>
      </main>
      <ToastContainer position="top-center" />
    </>
  );
};

export default LoginPage;