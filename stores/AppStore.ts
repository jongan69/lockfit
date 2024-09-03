import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useUserStore } from './UserStore';

interface AppState {
  notificationsEnabled: boolean;
  language: string;
  toggleNotifications: () => void;
  setLanguage: (lang: string) => void;
}

export const useAppStore = create(
  persist<AppState>(
    (set) => ({
      notificationsEnabled: false,
      language: 'English',
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const getUnits = () => {
  const { isImperial } = useUserStore.getState();
  return isImperial ? 'imperial' : 'metric';
};
