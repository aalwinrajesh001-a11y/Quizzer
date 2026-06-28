import { Question, ShuffledQuestion, QuizOption, QuizAnswer } from '@/types';
import { shuffle, pickRandom } from './shuffle';

/**
 * Map a correct answer letter from original option order to shuffled option order.
 * e.g. if original is [a,b,c,d] and shuffled is [c,a,d,b]
 * and correctAnswer is 'b', the shuffled correct answer is 'd' (index 3 → new position)
 */
function remapAnswer(
  answer: string,
  originalOptions: QuizOption[],
  shuffledOptions: QuizOption[]
): string {
  // Find the option with the original answer ID in the original options
  const originalOption = originalOptions.find((o) => o.id === answer);
  if (!originalOption) return answer;
  // Find its new position in the shuffled options
  const newIndex = shuffledOptions.findIndex((o) => o.id === originalOption.id);
  if (newIndex === -1) return answer;
  // Return the new position letter: 0→a, 1→b, 2→c, 3→d
  return String.fromCharCode(97 + newIndex);
}

/**
 * Shuffle a question's options and remap the correct answer accordingly.
 */
export function shuffleQuestion(question: Question): ShuffledQuestion {
  // Only shuffle options that have meaningful text
  const validOptions = question.options.filter((o) => o.text && o.text !== '–' && o.text !== '-');

  // Shuffle the valid options
  const shuffledOpts = shuffle(validOptions);

  // Reassign sequential IDs (a, b, c, d) to the shuffled options
  const shuffledOptions: QuizOption[] = shuffledOpts.map((opt, idx) => ({
    id: String.fromCharCode(97 + idx),
    text: opt.text,
    _originalId: opt.id, // keep original ID for remapping
  } as QuizOption & { _originalId: string }));

  // Remap correct answer(s) to new positions
  let shuffledCorrectAnswer: string | string[];
  if (question.isMultiAnswer && Array.isArray(question.correctAnswer)) {
    shuffledCorrectAnswer = question.correctAnswer.map((ans) => {
      const origOpt = validOptions.find((o) => o.id === ans);
      if (!origOpt) return ans;
      const newIdx = shuffledOpts.findIndex((o) => o.id === origOpt.id);
      return newIdx >= 0 ? String.fromCharCode(97 + newIdx) : ans;
    });
  } else {
    const ans = question.correctAnswer as string;
    const origOpt = validOptions.find((o) => o.id === ans);
    if (origOpt) {
      const newIdx = shuffledOpts.findIndex((o) => o.id === origOpt.id);
      shuffledCorrectAnswer = newIdx >= 0 ? String.fromCharCode(97 + newIdx) : ans;
    } else {
      shuffledCorrectAnswer = ans;
    }
  }

  return {
    id: question.id,
    question: question.question,
    originalOptions: validOptions,
    shuffledOptions,
    correctAnswer: question.correctAnswer,
    shuffledCorrectAnswer,
    isMultiAnswer: question.isMultiAnswer,
  };
}

/**
 * Prepare quiz questions: pick random N from pool, shuffle each question's options.
 */
export function prepareQuizQuestions(
  questions: Question[],
  count: number | 'all'
): ShuffledQuestion[] {
  const pool = count === 'all' ? questions : pickRandom(questions, count);
  return pool.map((q) => shuffleQuestion(q));
}

/**
 * Check if a selected answer is correct.
 */
export function checkAnswer(
  selected: string | string[] | null,
  shuffledCorrectAnswer: string | string[],
  isMultiAnswer: boolean
): boolean {
  if (selected === null) return false;
  if (isMultiAnswer && Array.isArray(shuffledCorrectAnswer)) {
    if (!Array.isArray(selected)) return false;
    const sortedSelected = [...selected].sort();
    const sortedCorrect = [...shuffledCorrectAnswer].sort();
    return (
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((s, i) => s === sortedCorrect[i])
    );
  }
  return selected === shuffledCorrectAnswer;
}

/**
 * Calculate quiz result stats.
 */
export function calculateStats(answers: QuizAnswer[]) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const wrong = total - correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  return { total, correct, wrong, percentage };
}

/**
 * Format time in seconds to mm:ss string.
 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
