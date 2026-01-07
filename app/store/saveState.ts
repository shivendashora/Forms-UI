import { create } from "zustand";

interface SaveState {
  save: boolean;
  setSaveState: (value: boolean) => void;
}

export const useSaveStore = create<SaveState>((set) => ({
  save: false,
  setSaveState: (value: boolean) => set({ save: value }),
}));
