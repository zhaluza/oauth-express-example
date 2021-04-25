import mongoose, { model, Schema, Document, Model } from 'mongoose';

// Schema definitions
interface IObject {
  [key: string]: any;
}

interface IOAuthToken {
  accessToken: string;
  accessTokenExpiresAt: mongoose.Date;
  client: IObject;
  clientId: string;
  refreshToken: string;
  refreshTokenExpiresAt: mongoose.Date;
  user: IObject;
  userId: string;
}

interface IOAuthTokenDoc extends IOAuthToken, Document {
  // define methods here
}

interface IOAuthTokenModel extends Model<IOAuthTokenDoc> {
  // define methods here
}

const OAuthTokenSchemaFields: Record<keyof IOAuthToken, any> = {
  accessToken: { type: String },
  accessTokenExpiresAt: { type: Date },
  client: { type: Object },
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresAt: { type: Date },
  user: { type: Object },
  userId: { type: String },
};

const OAuthTokenSchema = new Schema(OAuthTokenSchemaFields);

const OAuthToken = model<IOAuthTokenDoc, IOAuthTokenModel>(
  'oauthToken',
  OAuthTokenSchema
);

interface IOAuthCode {
  authorizationCode: string;
  expiresAt: mongoose.Date;
  client: IObject;
  clientId: string;
  redirectUri: string;
  scope: string;
  user: IObject;
  userId: string;
}

interface IOAuthCodeDoc extends IOAuthCode, Document {
  // define methods here
}

interface IOAuthCodeModel extends Model<IOAuthCodeDoc> {
  // define methods here
}

const OAuthCodeSchemaFields: Record<keyof IOAuthCode, any> = {
  authorizationCode: { type: String },
  expiresAt: { type: Date },
  client: { type: Object },
  clientId: { type: String },
  redirectUri: { type: String },
  scope: { type: String },
  user: { type: Object },
  userId: { type: String },
};

const OAuthCodeSchema = new Schema(OAuthCodeSchemaFields);

const OAuthCode = model<IOAuthCodeDoc, IOAuthCodeModel>(
  'oauthCode',
  OAuthCodeSchema
);

interface IOAuthClient {
  clientId: string;
  clientSecret: string;
  redirectUris: any[];
  grants: any[];
}

interface IOAuthClientDoc extends IOAuthClient, Document {
  // define methods here
}

interface IOAuthClientModel extends Model<IOAuthClientDoc> {
  // define methods here
}

const OAuthClientSchemaFields: Record<keyof IOAuthClient, any> = {
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUris: { type: Array },
  grants: { type: Array },
};

const OAuthClientSchema = new Schema(OAuthClientSchemaFields);

const OAuthClient = model<IOAuthClientDoc, IOAuthClientModel>(
  'oauthClient',
  OAuthClientSchema
);

interface IOAuthUser {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

interface IOAuthUserDoc extends IOAuthUser, Document {
  // define methods here
}

interface IOAuthUserModel extends Model<IOAuthUserDoc> {
  // define methods here
}

const OAuthUserSchemaFields: Record<keyof IOAuthUser, any> = {
  email: { type: String, default: '' },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  password: { type: String },
};

const OAuthUserSchema = new Schema(OAuthUserSchemaFields);

const OAuthUser = model<IOAuthUserDoc, IOAuthUserModel>(
  'oauthUser',
  OAuthUserSchema
);

/**
 * Get access token
 */

export const getAccessToken = (bearerToken: string) => {
  console.log('getAccessToken', bearerToken);
  return OAuthToken.findOne({ accessToken: bearerToken }).lean();
};

/**
 * Get client
 */

export const getClient = async (clientId: string, clientSecret: string) => {
  console.log('getClient', clientId, clientSecret);
  try {
    const instance = await OAuthClient.findOne({ clientId });
    console.log({ instance });
    if (instance?.id) return instance;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Get refresh token
 */

export const getRefreshToken = (refreshToken: string) => {
  console.log('getRefreshToken');
  return OAuthToken.findOne({ refreshToken }).lean();
};

export const getUser = async (username: string, password: string) => {
  console.log('getUser');
  try {
    const user = await OAuthUser.findOne({ username, password });
    console.log({ user });
    return user;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Save token
 */

export const saveToken = async (
  token: IOAuthTokenDoc,
  client: IOAuthClientDoc,
  user: IOAuthUserDoc
) => {
  console.log('saveToken');
  const accessToken = new OAuthToken({
    accessToken: token.accessToken,
    accessTokenExpiresOn: token.accessTokenExpiresAt,
    client,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    user,
    userId: user._id,
  });

  try {
    const savedToken = await accessToken.save();
    console.log({ savedToken });
    return savedToken;
  } catch (err) {
    console.error(err);
  }
};

export const saveAuthorizationCode = async (
  code: IOAuthCodeDoc,
  client: IOAuthClientDoc,
  user: IOAuthUserDoc
) => {
  console.log(`saveAuthorizationCode: ${code}`);
  const authCode = new OAuthCode({
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    clientId: client.id,
    userId: user.id,
  });

  try {
    const savedAuthCode = await authCode.save();
    console.log({ savedAuthCode });
    return savedAuthCode;
  } catch (err) {
    console.error(err);
  }
};

// // TODO: Finish implementing
// export const getAuthorizationCode: (
//   authorizationCode: string
// ) => Promise<AuthorizationCode | Falsey> = (authorizationCode) => {
//   console.log({ authorizationCode });
//   // fetch data stored from code
// };

// export const revokeAuthorizationCode = async () => {};

export const verifyScope = async () => {};
