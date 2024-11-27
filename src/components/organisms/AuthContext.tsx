import React, { createContext, useState } from 'react';
import axios from 'axios';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUserProfile: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  fetchUserProfile: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUserProfile = async (): Promise<User | null> => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/users/profile`, { withCredentials: true });
      const userData = response.data as User;
      setUser(userData);
      return userData;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, fetchUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};