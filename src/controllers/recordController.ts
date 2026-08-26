import type { Request, Response } from 'express';
import { prisma } from "../config/prisma.js";
import { generateAuditDiffs } from '../utils/audit.js';


export const listRecords = async (req: Request, res: Response) => {
  const { equipmentId, status, page = '1', limit = '10' } = req.query;
  const pageNum = parseInt(page as string, 10) || 1;
  const limitNum = parseInt(limit as string, 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};
  if (equipmentId) where.equipmentId = equipmentId as string;
  if (status) where.status = status as string;

  const [records, total] = await Promise.all([
    prisma.cleaningRecord.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { cleanedAt: 'desc' },
      include: { equipment: true },
    }),
    prisma.cleaningRecord.count({ where }),
  ]);

  res.json({
    data: records,
    meta: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
  });
};


export const createRecord = async (req: Request, res: Response) => {
  const { equipmentId, cleanedBy, cleanedAt, method, notes, status } = req.body;
  const record = await prisma.cleaningRecord.create({
    data: { equipmentId, cleanedBy, cleanedAt: new Date(cleanedAt), method, notes, status },
  });
  res.status(201).json(record);
};


export const updateRecord = async (req: Request, res: Response) => {
const { id } = req.params as { id: string };
  const { cleanedBy, cleanedAt, method, notes, status } = req.body;


  const current = await prisma.cleaningRecord.findUnique({ where: { id } });
  if (!current) return res.status(404).json({ error: 'Record not found' });


  const updateData: any = { cleanedBy, cleanedAt: new Date(cleanedAt), method, notes, status };


  const diffs = generateAuditDiffs(current, updateData, [
    'cleanedBy', 'cleanedAt', 'method', 'notes', 'status'
  ]);


  const updated = await prisma.$transaction(async (tx) => {
    const record = await tx.cleaningRecord.update({
      where: { id },
      data: updateData,
    });


    if (diffs.length > 0) {
      await tx.audit.createMany({
        data: diffs.map(diff => ({
          recordId: id,
          changedBy: 'system',
          field: diff.field,
          oldValue: diff.oldValue,
          newValue: diff.newValue,
        })),
      });
    }
    return record;
  });

  res.json(updated);
};
