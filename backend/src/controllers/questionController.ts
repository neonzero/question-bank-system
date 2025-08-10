import { Request, Response } from 'express';
import Question from '../models/Question';
import xlsx from 'xlsx';
import fs from 'fs';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' }).single('file');

export const getQuestions = async (req: Request, res: Response) => {
  const { domain, difficulty } = req.query;
  const filter: any = {};
  if (domain) filter.domain = domain;
  if (difficulty) filter.difficulty = difficulty;
  const questions = await Question.find(filter);
  res.json(questions);
};

export const createQuestion = async (req: Request, res: Response) => {
  const question = new Question(req.body);
  await question.save();
  res.status(201).json(question);
};

export const bulkUpload = (req: Request, res: Response, next: any) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ message: 'Upload error' });
    const workbook = xlsx.readFile(req.file?.path as string);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);
    const questions = data.map((row) => ({
      text: row.Question,
      options: [row.Option1, row.Option2, row.Option3, row.Option4],
      correctAnswer: row.CorrectAnswer - 1,
      explanation: row.Explanation,
      domain: row.Domain,
      difficulty: row.Difficulty || 'medium',
    }));
    await Question.insertMany(questions);
    fs.unlinkSync(req.file?.path as string); // Clean up
    res.json({ message: 'Bulk upload successful' });
  });
};

export const updateQuestion = async (req: Request, res: Response) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(question);
};

export const deleteQuestion = async (req: Request, res: Response) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
