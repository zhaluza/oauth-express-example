require('dotenv').config();
import express, { Request, Response } from 'express';
const app = express();
const PORT = process.env.PORT;

app.get('/', (req: Request, res: Response) =>
  res.send('Express Server, yeeeeaaahhh')
);

app.listen(PORT, () => {
  console.log(`⚡️ Server is running at http://localhost:${PORT}`);
});
