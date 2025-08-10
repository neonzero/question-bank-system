import { Request, Response } from 'express';
import Session from '../models/Session';

export const getProgress = async (req: Request, res: Response) => {
  const sessions = await Session.find({ userId: req.user.id }).sort({ startedAt: 1 });
  const trends = sessions.map(s => ({ date: s.startedAt.toISOString().split('T')[0], accuracy: s.score || 0 }));
  const domainBreakdown: any = {};
  sessions.forEach(s => {
    s.questions.forEach((q: any) => {
      const dom = q.questionId.domain; // Assume populated
      if (!domainBreakdown[dom]) domainBreakdown[dom] = { total: 0, correct: 0 };
      domainBreakdown[dom].total++;
      if (q.correct) domainBreakdown[dom].correct++;
    });
  });
  const weakDomains = Object.keys(domainBreakdown).filter(dom => (domainBreakdown[dom].correct / domainBreakdown[dom].total) < 0.5);
  res.json({
    dates: trends.map(t => t.date),
    accuracies: trends.map(t => t.accuracy),
    domains: Object.keys(domainBreakdown),
    scores: Object.values(domainBreakdown).map((d: any) => (d.correct / d.total) * 100),
    weakDomains,
  });
};
