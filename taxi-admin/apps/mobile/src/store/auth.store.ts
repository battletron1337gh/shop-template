import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (data: { access_token: string; user: User }) => void;
  logout: () => void;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: async (data) => {
    await AsyncStorage.setItem('token', data.access_token);
    set({
      user: data.user,
      token: data.access_token,
      isAuthenticated: true,
    });
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
  init: async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      set({ token, isAuthenticated: true });
      // Optionally fetch user data here
    }
  },
}));
