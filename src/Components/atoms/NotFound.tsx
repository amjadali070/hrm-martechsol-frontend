import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-800 mt-20">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-purple-700">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mt-4">Page Not Found</h2>
        <p className="text-lg mt-2">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-sm mt-1 text-gray-600">
          Maybe you mistyped the URL? Let’s help you get back on track.
        </p>
      </div>
      <div className="mt-8">
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-800 transition-all duration-200"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;