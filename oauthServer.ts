import OAuthServer from 'express-oauth-server';
import * as model from './models';

export default new OAuthServer({
  // NOTE: oauth2-server and mongoose have conflicting types
  //@ts-ignore:disable-next-line
  model,
  grants: ['authorizationCode', 'refreshToken'],
  accessTokenLifetime: 60 * 60 * 24, // 1 day
  allowEmptyState: true,
  allowExtendedTokenAttributes: true,
  debug: true,
});
