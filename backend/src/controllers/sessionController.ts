import { Request, Response } from 'express';
import Session from '../models/Session';
import Question from '../models/Question';
import Domain from '../models/Domain';

export const startPractice = async (req: Request, res: Response) => {
  const { domains, numQuestions } = req.body;
  const questions = await Question.aggregate([{ $match: { domain: { $in: domains } } }, { $sample: { size: numQuestions } }]);
  const session = new Session({ userId: req.user.id, type: 'practice', domains, questions: questions.map(q => ({ questionId: q._id })) });
  await session.save();
  res.json({ sessionId: session._id, questions });
};

export const startExam = async (req: Request, res: Response) => {
  const { numQuestions, duration } = req.body;
  const allDomains = await Domain.find();
  const totalWeight = allDomains.reduce((sum, d) => sum + d.weight, 0);
  const questions: any[] = [];
  for (const dom of allDomains) {
    const count = Math.round((dom.weight / totalWeight) * numQuestions);
    const domQuestions = await Question.aggregate([{ $match: { domain: dom.name } }, { $sample: { size: count } }]);
    questions.push(...domQuestions);
  }
  const session = new Session({ userId: req.user.id, type: 'exam', questions: questions.map(q => ({ questionId: q._id })), duration });
  await session.save();
  res.json({ sessionId: session._id, questions });
};

export const answerQuestion = async (req: Request, res: Response) => {
  const { sessionId, questionId, answer, timeSpent } = req.body;
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  const qIndex = session.questions.findIndex(q => q.questionId.toString() === questionId);
  if (qIndex === -1) return res.status(404).json({ message: 'Question not found' });
  const question = await Question.findById(questionId);
  const correct = question.correctAnswer === answer;
  session.questions[qIndex].userAnswer = answer;
  session.questions[qIndex].correct = correct;
  session.questions[qIndex].timeSpent = timeSpent;
  await session.save();
  if (session.type === 'practice') {
    return res.json({ correct, explanation: question.explanation });
  }
  res.json({ message: 'Answer recorded' });
};

export const endSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  const session = await Session.findById(sessionId).populate('questions.questionId');
  if (!session) return res.status(404).json({ message: 'Session not found' });
  session.endedAt = new Date();
  const correctCount = session.questions.filter(q => q.correct).length;
  session.score = (correctCount / session.questions.length) * 100;
  await session.save();

  // Calculate weak domains
  const domainPerformance: any = {};
  session.questions.forEach((q: any) => {
    const dom = q.questionId.domain;
    if (!domainPerformance[dom]) domainPerformance[dom] = { total: 0, correct: 0 };
    domainPerformance[dom].total++;
    if (q.correct) domainPerformance[dom].correct++;
  });
  const weakDomains = Object.keys(domainPerformance).filter(dom => (domainPerformance[dom].correct / domainPerformance[dom].total) < 0.5);

  const report = {
    score: session.score,
    questions: session.questions.map((q: any) => ({
      text: q.questionId.text,
      userAnswer: q.userAnswer,
      correctAnswer: q.questionId.correctAnswer,
      explanation: q.questionId.explanation,
    })),
    weakDomains,
  };
  res.json(report);
};
