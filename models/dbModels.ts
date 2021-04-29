import mongoose, {
  model,
  Schema,
  Document,
  Model,
  isValidObjectId,
} from 'mongoose';

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

export const getRefreshToken = async (refreshTokenString: string) => {
  console.log('getRefreshToken', refreshTokenString);
  const token = await OAuthToken.findOne({ refreshToken: refreshTokenString });
  if (!token) return;
  // add client id as property to token

  const {
    accessToken,
    accessTokenExpiresAt,
    client,
    clientId,
    refreshToken,
    refreshTokenExpiresAt,
    userId,
    user,
  } = token;

  const formattedToken: IOAuthToken = {
    accessToken,
    accessTokenExpiresAt,
    client,
    clientId,
    refreshToken,
    refreshTokenExpiresAt,
    userId,
    user,
  };

  formattedToken.client.id = formattedToken.client._id.toString();

  console.log('formatted token: ', formattedToken);
  return formattedToken;
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
    accessTokenExpiresAt: token.accessTokenExpiresAt,
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
  console.log(`saveAuthorizationCode: ${JSON.stringify(code)}`);
  // TODO: Document should be deleted when it expires
  // FIXME: Entire user and client should not be saved to code doc
  const authCode = new OAuthCode({
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    clientId: client.id,
    client,
    userId: user.id,
    user,
  });
  authCode.client.id = client.id;
  try {
    const savedAuthCode = await authCode.save();
    console.log({ savedAuthCode });
    return savedAuthCode;
  } catch (err) {
    console.error(err);
  }
};

export const revokeToken = (token: IOAuthToken) => {
  console.log('revoke token: ', token);
  if (!token) return false;
  return true;
};

export const getAuthorizationCode = async (authorizationCode: string) => {
  /* this is where we fetch the stored data from the code */
  console.log('get authorization code: ', authorizationCode);
  try {
    const authCodeDb = await OAuthCode.findOne({ authorizationCode });
    if (!authCodeDb) return;

    // Recasting our return object to have a client.id property that the oauth library will recognize
    const formattedAuthCode: IOAuthCode = {
      authorizationCode: authCodeDb.authorizationCode,
      expiresAt: authCodeDb.expiresAt,
      redirectUri: authCodeDb.redirectUri,
      scope: authCodeDb.scope,
      clientId: authCodeDb.clientId,
      client: authCodeDb.client,
      userId: authCodeDb.userId,
      user: authCodeDb.user,
    };

    formattedAuthCode.client.id = formattedAuthCode.client._id.toString();
    console.log('authorization code sent', formattedAuthCode);

    return formattedAuthCode;
  } catch (err) {
    console.error(err);
  }
};

export const revokeAuthorizationCode = async (authCode: IOAuthCode) => {
  console.log('revoke authorization code: ', authCode);
  const deletedAuthCode = await OAuthCode.deleteMany({
    authorizationCode: authCode.authorizationCode,
  });
  if (deletedAuthCode) {
    console.log('authorization code deleted: ', deletedAuthCode);
  }
  return !!deletedAuthCode;
};

export const verifyScope = (token: string, scope: any) => {
  // TODO: fill this out, currently just returning true
  console.log('verifying scope: ', token, scope);
  const userHasAccess = true;
  return userHasAccess;
};

// Extra methods

export const createUser = async (user: IOAuthUser) => {
  try {
    const newUser = await OAuthUser.create(user);
    console.log('user created: ', newUser);
  } catch (err) {
    console.error(err);
  }
};

export const createClient = async (client: IOAuthClient) => {
  try {
    const newClient = await OAuthClient.create(client);
    console.log('client created: ', newClient);
  } catch (err) {
    console.error(err);
  }
};

export const deleteAllCodesAndTokens = async () => {
  try {
    await OAuthCode.deleteMany({});
    await OAuthToken.deleteMany({});
    console.log('successfully deleted existing codes and tokens');
  } catch (err) {
    console.error(err);
  }
};
