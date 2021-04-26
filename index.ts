require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import DebugControl from './utils/debug';
import oauthServer from './oauthServer';
import initializeDb from './db';
import authRouter from './routes/auth';
import clientRouter from './routes/client';
import secureRouter from './routes/secure';

const app = express();
const PORT = process.env.PORT;

initializeDb();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(DebugControl.log.request());

app.use('/client', clientRouter);
app.use('/oauth', authRouter);
app.use(
  '/secure',
  (req: Request, res: Response, next: NextFunction) => {
    DebugControl.log.flow('Authentication');
    return next();
  },
  oauthServer.authenticate(),
  secureRouter
);

app.use('/', (req: Request, res: Response) => res.redirect('/client'));

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at http://localhost:${PORT}`);
});
