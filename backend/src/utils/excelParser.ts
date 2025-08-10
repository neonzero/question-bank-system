// backend/src/utils/excelParser.ts
import xlsx from 'xlsx';
import { QuestionDocument } from '../models/Question'; // Import the Question model type if using TypeScript interfaces

export const parseQuestionsFromExcel = (filePath: string): Partial<QuestionDocument>[] => {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data: any[] = xlsx.utils.sheet_to_json(sheet);
  
  return data.map((row) => ({
    text: row.Question,
    options: [row.Option1, row.Option2, row.Option3, row.Option4],
    correctAnswer: row.CorrectAnswer - 1, // Convert to 0-based index
    explanation: row.Explanation,
    domain: row.Domain,
    difficulty: row.Difficulty || 'medium',
  }));
};
