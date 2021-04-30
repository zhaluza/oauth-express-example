import {
  IOAuthUser,
  OAuthUser,
  IOAuthClient,
  OAuthClient,
  OAuthCode,
  OAuthToken,
} from '../models';

// Below are all methods not used by the oauth server

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

export const getRedirectUrl = async (code: string) => {
  const authCode = await OAuthCode.findOne({ authorizationCode: code });
  if (!authCode) return '';
  return authCode.redirectUri;
};
