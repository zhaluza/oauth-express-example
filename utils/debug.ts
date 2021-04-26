import { Request, Response, NextFunction } from 'express';

enum LEVELS {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}
let level = LEVELS.HIGH;

const debugControl = {
  setLevel: (l: LEVELS) => (level = l),

  log: {
    parameters: (parameters: any[]) => {
      if (LEVELS.HIGH > level) return;
      console.group();
      parameters.forEach((p) => console.log(`${p.name}: `, p.value));
      console.groupEnd();
    },
    functionName: (name: string) => {
      if (LEVELS.MEDIUM > level) return;
      console.log(`\nEXECUTING: ${name}\n`);
    },
    flow: (flow: string) => {
      if (LEVELS.LOW > level) return;
      console.log(`\n\n\nBEGIN FLOW: ${flow}\n\n\n`);
    },
    variable: ({ name, value }: { name: string; value: string }) => {
      if (LEVELS.HIGH > level) return;
      console.group();
      console.group();
      console.log(`VARIABLE ${name}:`, value);
      console.groupEnd();
      console.groupEnd();
    },
    request: () => (req: Request, res: Response, next: NextFunction) => {
      if (LEVELS.HIGH > level) return next();
      console.log('Hit URL', req.url, 'with following:');
      console.group();
      console.log('Query:', req.query);
      console.log('Body:', req.body);
      console.groupEnd();
      return next();
    },
  },
};

export default debugControl;
