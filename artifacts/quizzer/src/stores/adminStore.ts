import { create } from 'zustand';
import { AdminCredentials, DEFAULT_ADMIN_CREDENTIALS } from '@/types';

const ADMIN_CREDS_KEY = 'quizzer_admin_creds';

function loadAdminCredentials(): AdminCredentials {
  try {
    const saved = localStorage.getItem(ADMIN_CREDS_KEY);
    if (saved) return JSON.parse(saved) as AdminCredentials;
  } catch {
    // ignore
  }
  return DEFAULT_ADMIN_CREDENTIALS;
}

interface AdminStore {
  isAuthenticated: boolean;
  credentials: AdminCredentials;
  loginError: string | null;

  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (newCreds: AdminCredentials) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  isAuthenticated: false,
  credentials: loadAdminCredentials(),
  loginError: null,

  login: (username, password) => {
    const { credentials } = get();
    if (username === credentials.username && password === credentials.password) {
      set({ isAuthenticated: true, loginError: null });
      return true;
    }
    set({ loginError: 'Invalid username or password' });
    return false;
  },

  logout: () => set({ isAuthenticated: false }),

  updateCredentials: (newCreds) => {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(newCreds));
    set({ credentials: newCreds });
  },
}));
