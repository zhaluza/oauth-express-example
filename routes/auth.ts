import path from 'path';
import { Router, Request as ExpressRequest } from 'express';
import oauthServer from '../oauthServer';
import DebugControl from '../utils/debug';
import { getUser, deleteAllCodesAndTokens } from '../models/dbModels';

const router = Router();

const filePath = path.join(__dirname, '../public/oauthAuthenticate.html');

router.get('/', (req, res) => {
  res.sendFile(filePath);
});

router.post(
  '/authorize',
  (req, res, next) => {
    DebugControl.log.flow('Initial User Authentication');
    const { username, password } = req.body;
    if (username === 'username' && password === 'password') {
      req.body.user = getUser(username, password);
      return next();
    }
    const params = [
      'client_id',
      'redirect_uri',
      'response_type',
      'grant_type',
      'state',
    ]
      .map((a) => `${a}=${req.body[a]}`)
      .join('&');
    console.log('params: ', params);
    return res.redirect(`/oauth?success=false&${params}`);
  },
  (req, res, next) => {
    // sends us to our redirect with an authorization code in our url
    DebugControl.log.flow('Authorization');
    return next();
  },
  oauthServer.authorize({
    authenticateHandler: {
      handle: (req: ExpressRequest) => {
        DebugControl.log.functionName('Authenticate Handler');
        DebugControl.log.parameters(
          Object.keys(req.body).map((k) => ({ name: k, value: req.body[k] }))
        );
        return req.body.user;
      },
    },
  })
);

router.post(
  '/token',
  (req, res, next) => {
    DebugControl.log.flow('Token');
    console.log(req.body, req.query);
    // TODO: attach the redirect uri to the request! (add a middleware)
    req.body.redirect_uri = 'http://localhost:8000/client/app';
    return next();
  },
  oauthServer.token({
    requireClientAuthentication: {
      // Does the client need to provide a client secret?
      //   authorization_code: false,
    },
  })
);
// Sends back token

router.delete('/', (req, res) => {
  deleteAllCodesAndTokens();
  res.json({ message: 'successful' });
});

export default router;
