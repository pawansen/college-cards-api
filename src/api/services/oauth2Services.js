const { env } = require('../../infrastructure/env'),
  bcrypt = require('bcrypt'),
  saltRounds = 10;
const OAuthTokenSchema = require('../domain/schema/mongoose/oauthTokens.schema');
const userSchema = require('../domain/schema/mongoose/user.schema');
/**
 * Get client.
 */

module.exports.getClient = async function (clientId, clientSecret) {
  return {
    clientId: env.OAUTH_CLIENT_ID,
    clientSecret: env.OAUTH_CLIENT_SECRET,
    grants: ['password', 'refresh_token'], // the list of OAuth2 grant types that should be allowed
  }
}

/**
 * Save token.
 */
module.exports.saveToken = async function (token, client, user) {
  let payload = {
    user_id: user._id,
    client_id: client.clientId,
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    access_token_expires_on: token.accessTokenExpiresAt,
    refresh_token_expires_on: token.refreshTokenExpiresAt,
    user: JSON.stringify(user),
  }
  await OAuthTokenSchema.deleteMany({ user_id: user._id })
  const insert = await OAuthTokenSchema.create(payload);
  return {
    ...user.dataValues,
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    client: { id: client.id },
    access_token: token.accessToken,
    refresh_token: token.refreshToken,
    user: user,
  }
}

/**
 * Get refresh token.
 */

module.exports.getRefreshToken = async function (bearerToken) {
  const result = await OAuthTokenSchema.findOne({ refresh_token: bearerToken }).lean();

  if (!result) return false;
  if (new Date(result.refresh_token_expires_on) < new Date()) return false; // expired
  return {
    refreshToken: result.refresh_token,
    refreshTokenExpiresAt: new Date(result.refresh_token_expires_on),
    client: result.client_id,
    user: JSON.parse(result.user),
  };
};

/*
 * Get user.
 */

module.exports.getUser = async function (email, password) {
  const user = await userSchema.findOne(
    { email: email },
    {
      _id: 1,
      user_id: 1,
      firstName: 1,
      lastName: 1,
      email: 1,
      mobile: 1,
      role: 1,
      token: 1,
      refreshToken: 1,
      referralCode: 1,
      profileImage: 1,
      deviceId: 1,
      createDate: 1,
      lastLoginAt: 1,
      deviceToken: 1,
      password: 1, deviceType: 1, loginType: 1, isActive: 1, isEmailVerified: 1, isMobileVerified: 1, isDelete: 1
    }
  ).lean();
  if (user) {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return false;
    } else {
      delete user.password;
      return user;
    }
  } else {
    return false;
  }
}

/*
 * Get access token.
 */

module.exports.getAccessToken = async function (bearerToken) {
  const result = await OAuthTokenSchema.findOne({ access_token: bearerToken }).lean();
  return result
    ? {
      accessToken: result.access_token,
      accessTokenExpiresAt: new Date(result.access_token_expires_on),
      client: { id: result.client_id },
      user: JSON.parse(result.user),
    }
    : false;
}

module.exports.revokeToken = async function (token) {
  const result = await OAuthTokenSchema.deleteOne({ refresh_token: token.refreshToken });
  return result.deletedCount > 0;
}