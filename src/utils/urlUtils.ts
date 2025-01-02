// src/utils/urlUtils.ts

import axiosInstance from "./axiosConfig";

/**
 * Converts a given path to a full URL.
 * - If the path is already an absolute URL, returns it as is.
 * - If the path is a relative path, prepends the backend base URL.
 * - Replaces backslashes with forward slashes for consistency.
 *
 * @param path - The vehicle picture or document path.
 * @returns The full URL or null if the path is invalid.
 */
export const getFullUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;

  // Check if the path is already an absolute URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Replace backslashes with forward slashes
  const normalizedPath = path.replace(/\\/g, "/");

  // Remove any leading slashes to prevent double slashes in URL
  const cleanPath = normalizedPath.startsWith("/")
    ? normalizedPath.slice(1)
    : normalizedPath;

  // Get the backend base URL without the '/api' segment
  const backendBaseUrl = axiosInstance.defaults.baseURL
    ? axiosInstance.defaults.baseURL.replace("/api", "")
    : "";

  return `${backendBaseUrl}/${cleanPath}`;
};
