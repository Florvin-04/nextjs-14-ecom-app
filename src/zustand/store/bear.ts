import { create } from "zustand";
import { createStoreWithSelectors } from "./createStore";

type Store = {
  bears: number;
  decrease: number;
  increase: number;
  increasePopulation: () => void;
  decreasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
};

const useBearStore = createStoreWithSelectors(
  create<Store>((set) => ({
    bears: 0,
    decrease: 0,
    increase: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    decreasePopulation: () => set((state) => ({ bears: state.bears - 1 })),
    removeAllBears: () => set({ bears: 0 }),
    updateBears: (newBears) => set({ bears: newBears }),
  }))
);

export default useBearStore;
