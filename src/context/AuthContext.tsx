import React, { createContext, useState, useContext } from 'react';
import { User, Entrepreneur, Investor, UserRole, AuthContextType } from '../types';
import { users } from '../data/users';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'business_nexus_user';
const RESET_TOKEN_KEY = 'business_nexus_reset_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login
  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 500));
      const foundUser = users.find(u => u.email === email && u.role === role);
      if (!foundUser) throw new Error('Invalid credentials');
      setUser(foundUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(foundUser));
      toast.success('Logged in!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      await new Promise(res => setTimeout(res, 500));
      if (users.some(u => u.email === email)) throw new Error('Email already in use');

      let newUser: Entrepreneur | Investor;

      if (role === 'entrepreneur') {
        newUser = {
          id: `E${users.length + 1}`,
          name,
          email,
          role,
          avatarUrl: '',
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
          startupName: '',
          pitchSummary: '',
          fundingNeeded: '',
          industry: '',
          location: '',
          foundedYear: 0,
          teamSize: 0,
        };
      } else {
        newUser = {
          id: `I${users.length + 1}`,
          name,
          email,
          role,
          avatarUrl: '',
          bio: '',
          isOnline: true,
          createdAt: new Date().toISOString(),
          investmentInterests: [],
          investmentStage: [],
          portfolioCompanies: [],
          totalInvestments: 0,
          minimumInvestment: '',
          maximumInvestment: '',
        };
      }

      users.push(newUser);
      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
      toast.success('Account created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

// Update profile
const updateProfile = async (
  userId: string,
  updates: Partial<Entrepreneur | Investor>
) => {
  try {
    await new Promise<void>((res) => setTimeout(res, 500));

    // Find the user index
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found');

    // Ensure updatedUser matches the array element type
    const updatedUser = {
      ...users[idx],
      ...updates
    } as typeof users[number]; // this strictly matches Entrepreneur | Investor

    // Update the array safely
    users.splice(idx, 1, updatedUser);

    // Update state and localStorage if it's the current logged-in user
    if (user?.id === userId) {
      setUser(updatedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    }

    toast.success('Profile updated successfully');
  } catch (err: any) {
    toast.error(err.message || 'Failed to update profile');
    throw err;
  }
};
  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    toast.success('Logged out');
  };

  // Forgot password
  const forgotPassword = async (email: string) => {
    try {
      await new Promise(res => setTimeout(res, 500));
      if (!users.some(u => u.email === email)) throw new Error('No account found with this email');
      const token = Math.random().toString(36).slice(2);
      localStorage.setItem(RESET_TOKEN_KEY, token);
      toast.success('Reset link sent');
    } catch (err: any) {
      toast.error(err.message || 'Failed');
      throw err;
    }
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await new Promise(res => setTimeout(res, 500));
      const stored = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== stored) throw new Error('Invalid token');
      localStorage.removeItem(RESET_TOKEN_KEY);
      toast.success('Password reset successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed');
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    updateProfile,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};