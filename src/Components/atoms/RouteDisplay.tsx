import React from "react";
import { useLocation, Link } from "react-router-dom";

const RouteDisplay: React.FC = () => {
  const location = useLocation();

  // Function to format route segments
  const formatRouteName = (segment: string) => {
    return segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Split the pathname and filter out empty segments
  const routeSegments = location.pathname
    .split("/")
    .filter((segment) => segment !== "");

  // Skip route display for specific paths
  const hiddenRoutePaths = ["/dashboard", "/login", "/"];
  if (hiddenRoutePaths.includes(location.pathname)) {
    return null;
  }

  // Generate breadcrumb paths
  const breadcrumbs = routeSegments.map((segment, index) => ({
    name: formatRouteName(segment),
    path: `/${routeSegments.slice(0, index + 1).join("/")}`,
    isLast: index === routeSegments.length - 1,
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-sm font-medium text-gray-700 px-4 "
    >
      <Link
        to="/dashboard"
        className="text-gray-500 hover:text-purple-600 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <Link
            to={crumb.path}
            className={`
              transition-all duration-300 ease-in-out
              ${
                crumb.isLast
                  ? "text-purple-600 font-bold hover:text-purple-700"
                  : "text-gray-600 hover:text-purple-500 hover:underline"
              }
              flex items-center gap-2
            `}
          >
            <span className="max-w-40 truncate">{crumb.name}</span>
            {crumb.isLast && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full ml-2">
                Current
              </span>
            )}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default RouteDisplay;
