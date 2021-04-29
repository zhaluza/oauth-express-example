import { Router } from 'express';
import { createUser } from '../models/dbModels';

const router = Router();

router.post('/', (req, res) => {
  const { email, firstName, lastName, username, password } = req.body;
  if (!email || !firstName || !lastName || !username || !password)
    return res.json({ message: 'Must include all user fields' });
  createUser({ email, firstName, lastName, username, password });
  return res.json({ status: 'successful' });
});

export default router;
