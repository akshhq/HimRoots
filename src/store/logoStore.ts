import { create } from "zustand";

interface LogoStoreState {
  isHeroLogoVisible: boolean;
  setIsHeroLogoVisible: (visible: boolean) => void;
}

export const useLogoStore = create<LogoStoreState>((set) => ({
  isHeroLogoVisible: true,
  setIsHeroLogoVisible: (visible: boolean) => set({ isHeroLogoVisible: visible }),
}));
