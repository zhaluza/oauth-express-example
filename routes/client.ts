import path from 'path';
import { Router } from 'express';
import { createClient } from '../models/dbModels';

const router = Router();
router.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/clientAuthenticate.html'))
);

router.get('/app', (req, res) =>
  res.sendFile(path.join(__dirname, '../public/clientApp.html'))
);

router.post('/', (req, res) => {
  const { clientId, clientSecret, redirectUris, grants } = req.body;
  if (!clientId || !clientSecret || !redirectUris || !grants)
    return res.json({ message: 'Please include all client fields' });
  createClient({ clientId, clientSecret, grants, redirectUris });
  return res.json({ status: 'successful' });
});

export default router;
