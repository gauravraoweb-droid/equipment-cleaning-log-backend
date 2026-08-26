import type { Request, Response } from 'express';
import { prisma } from "../config/prisma.js";


export const getAuditHistory = async (req: Request, res: Response) => {
  const { recordId } = req.params;
  const audits = await prisma.audit.findMany({
    where: { recordId },
    orderBy: { changedAt: 'asc' },
  });
  res.json(audits);
};