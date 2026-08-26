import type { Request, Response } from 'express';
import { prisma } from "../config/prisma.js";


export const listEquipment = async (req: Request, res: Response) => {
  const equipment = await prisma.equipment.findMany();
  res.json(equipment);
};

export const createEquipment = async (req: Request, res: Response) => {
  const { name, code, status } = req.body;
  const equipment = await prisma.equipment.create({
    data: { name, code, status },
  });
  res.status(201).json(equipment);
};

export const updateEquipment = async (req: Request, res: Response) => {
const { id } = req.params as { id: string };
  const { name, code, status } = req.body;
  const equipment = await prisma.equipment.update({
    where: { id },
    data: { name, code, status },
  });
  res.json(equipment);
};

export const deleteEquipment = async (req: Request, res: Response) => {
const { id } = req.params as { id: string };
  await prisma.equipment.delete({ where: { id } });
  res.status(204).send();
};
