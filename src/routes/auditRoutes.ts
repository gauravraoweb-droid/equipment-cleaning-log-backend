import express from 'express';
import { getAuditHistory } from '../controllers/auditController.js';

const router = express.Router();

router.get('/:recordId', getAuditHistory);

export default router;