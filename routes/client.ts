import path from 'path';
import { Router } from 'express';

const router = Router();
router.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/clientAuthenticate.html'))
);

router.get('/app', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/clientApp.html'))
);

export default router;
