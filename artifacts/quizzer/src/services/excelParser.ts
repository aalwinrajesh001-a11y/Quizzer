import * as XLSX from 'xlsx';
import { QuizModule, Question, QuizOption } from '@/types';

/**
 * Parse the correct answer string from Excel cell value.
 * Handles formats like "b) CHATGPT", "a) True", "a, c" (multi-answer).
 * Returns a single letter string or an array of letters.
 */
function parseCorrectAnswer(val: unknown): string | string[] {
  if (!val) return 'a';
  const s = String(val).trim().toLowerCase();

  // Handle multi-answer like "a, c" or "a,c"
  if (s.includes(',')) {
    const letters = s
      .split(',')
      .map((x) => x.trim().charAt(0))
      .filter((x) => /^[a-d]$/.test(x));
    if (letters.length > 1) return letters;
  }

  // Handle "b) CHATGPT" or "b) answer text"
  const match = s.match(/^([a-d])\)/);
  if (match) return match[1];

  // Handle just "a" or "b" etc.
  if (/^[a-d]$/.test(s.charAt(0))) return s.charAt(0);

  return 'a';
}

/**
 * Parse a single worksheet into a QuizModule.
 */
function parseSheet(ws: XLSX.WorkSheet, sheetName: string, index: number): QuizModule {
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(ws, { header: 1 });

  const questions: Question[] = [];

  // Start from row 1 (skip header row 0)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] as (string | number | undefined)[];
    if (!row || !row[1]) continue; // skip empty rows

    const questionText = String(row[1] || '').trim();
    if (!questionText) continue;

    const optTexts = [
      String(row[2] || '').trim(),
      String(row[3] || '').trim(),
      String(row[4] || '').trim(),
      String(row[5] || '').trim(),
    ];

    // Build options array — filter out empty / dash placeholders
    const options: QuizOption[] = optTexts
      .map((text, idx) => ({ id: String.fromCharCode(97 + idx), text }))
      .filter((o) => o.text && o.text !== '–' && o.text !== '-' && o.text !== '');

    const correctRaw = parseCorrectAnswer(row[6]);

    questions.push({
      id: String(row[0] || `Q${i}`).trim(),
      question: questionText,
      options,
      correctAnswer: correctRaw,
      isMultiAnswer: Array.isArray(correctRaw),
    });
  }

  // Build a clean module ID from the sheet name
  const moduleId = sheetName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  return {
    id: moduleId || `module-${index + 1}`,
    name: sheetName,
    questions,
  };
}

/**
 * Parse an Excel workbook File into an array of QuizModules.
 * Each sheet becomes one module. Module names come from sheet names.
 */
export async function parseExcelWorkbook(file: File): Promise<QuizModule[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error('Failed to read file');

        const workbook = XLSX.read(data, { type: 'array' });
        const modules: QuizModule[] = workbook.SheetNames.map((name, idx) =>
          parseSheet(workbook.Sheets[name], name, idx)
        ).filter((m) => m.questions.length > 0);

        if (modules.length === 0) {
          reject(new Error('No valid questions found in the workbook'));
          return;
        }

        resolve(modules);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read the file'));
    reader.readAsArrayBuffer(file);
  });
}
