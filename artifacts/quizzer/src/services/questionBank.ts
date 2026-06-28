import { Category, QuizModule } from '@/types';
import { parseExcelWorkbook } from './excelParser';
import defaultNasscomData from '../data/nasscomData.json';

const STORAGE_KEY = 'quizzer_question_bank';
const CUSTOM_BANK_KEY = 'quizzer_custom_bank';

/**
 * Build the default NASSCOM category from embedded data.
 */
function buildDefaultNasscomCategory(): Category {
  const modules: QuizModule[] = (defaultNasscomData as QuizModule[]).map((m) => ({
    id: m.id,
    name: m.name,
    questions: m.questions,
  }));

  return {
    id: 'nasscom',
    name: 'NASSCOM Digital Edge 101',
    description: 'IT & Emerging Technologies certification — AI, IoT, Cloud, Cybersecurity & more',
    icon: 'Monitor',
    color: 'from-blue-600 to-indigo-700',
    modules,
  };
}

/**
 * Load all categories. Custom uploaded banks override the default NASSCOM data.
 */
export function loadCategories(): Category[] {
  try {
    const customBank = localStorage.getItem(CUSTOM_BANK_KEY);
    if (customBank) {
      const parsed = JSON.parse(customBank) as Category[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fall back to default
  }

  return [buildDefaultNasscomCategory()];
}

/**
 * Save a custom uploaded question bank for a given category.
 */
export function saveCustomCategory(categoryId: string, modules: QuizModule[]): void {
  const existing = loadCategories();
  const updated = existing.map((cat) => {
    if (cat.id === categoryId) {
      return { ...cat, modules };
    }
    return cat;
  });

  // If category didn't exist, add it
  if (!updated.find((c) => c.id === categoryId)) {
    updated.push({
      id: categoryId,
      name: categoryId.toUpperCase(),
      description: 'Uploaded question bank',
      icon: 'BookOpen',
      color: 'from-green-600 to-teal-700',
      modules,
    });
  }

  localStorage.setItem(CUSTOM_BANK_KEY, JSON.stringify(updated));
}

/**
 * Upload and parse an Excel workbook, replacing the question bank for the given category.
 * Returns modules parsed from the workbook.
 */
export async function uploadExcelWorkbook(
  file: File,
  categoryId: string = 'nasscom'
): Promise<QuizModule[]> {
  const modules = await parseExcelWorkbook(file);
  saveCustomCategory(categoryId, modules);
  return modules;
}

/**
 * Reset the question bank for a category to its default state.
 */
export function resetToDefault(): void {
  localStorage.removeItem(CUSTOM_BANK_KEY);
}

/**
 * Get all modules for a category.
 */
export function getModulesForCategory(categories: Category[], categoryId: string): QuizModule[] {
  const cat = categories.find((c) => c.id === categoryId);
  return cat ? cat.modules : [];
}

/**
 * Get total question count across all modules in a category.
 */
export function getTotalQuestionCount(modules: QuizModule[]): number {
  return modules.reduce((sum, m) => sum + m.questions.length, 0);
}
