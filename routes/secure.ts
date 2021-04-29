import { Router } from 'express';
import DebugControl from '../utils/debug';

const router = Router();

router.get('/', (req, res) => {
  console.log('/secure');
  // Successfully reached if we hit this
  DebugControl.log.variable({
    name: 'res.locals.oauth.token',
    value: res.locals.oauth.token,
  });
  res.json({ success: true });
});

export default router;
