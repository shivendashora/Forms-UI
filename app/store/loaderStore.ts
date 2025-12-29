import { create } from "zustand";

interface LoaderState {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const useLoaderStore = create<LoaderState>((set) => ({
  loading: false,
  setLoading: (value: boolean) => set({ loading: value }),
}));
