import { create } from 'zustand';
import { Category } from '@/types';
import { loadCategories } from '@/services/questionBank';

interface CategoryStore {
  categories: Category[];
  isLoaded: boolean;
  refresh: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isLoaded: false,

  refresh: () => {
    const categories = loadCategories();
    set({ categories, isLoaded: true });
  },
}));
