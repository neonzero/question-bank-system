import { Request, Response } from 'express';
import Domain from '../models/Domain';

export const getDomains = async (req: Request, res: Response) => {
  const domains = await Domain.find();
  res.json(domains);
};

export const createDomain = async (req: Request, res: Response) => {
  const domain = new Domain(req.body);
  await domain.save();
  res.status(201).json(domain);
};

export const updateDomain = async (req: Request, res: Response) => {
  const domain = await Domain.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(domain);
};

export const deleteDomain = async (req: Request, res: Response) => {
  await Domain.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
