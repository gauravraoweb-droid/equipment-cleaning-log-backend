import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import equipmentRoutes from './routes/equipmentRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.get('/test', (req, res) => {
  res.json({
    message: 'Backend is working',
  });
});

app.use('/api/equipment', equipmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/audits', auditRoutes);
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
