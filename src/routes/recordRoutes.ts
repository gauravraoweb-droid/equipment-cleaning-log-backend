import express from 'express';
import { listRecords, createRecord, updateRecord } from '../controllers/recordController.js';

const router = express.Router();

router.get('/', listRecords);
router.post('/', createRecord);
router.put('/:id', updateRecord);

export default router;