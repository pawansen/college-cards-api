const { UnauthorizedResponse } = require('../utils/apiResponse'),
  { ERROR_MESSAGES } = require('../../../config/constants'),
  { decode } = require('../lib/jwt'),
  OAuth2Server = require('oauth2-server'),
  { env } = require('../../infrastructure/env'),
  Request = OAuth2Server.Request,
  Response = OAuth2Server.Response,
  oauth = new OAuth2Server({
    model: require('../services/oauth2Services'),
    accessTokenLifetime: env.OAUTH_TOKEN_EXPIRE,
    allowBearerTokensInQueryString: true,
  })
/**
 *
 * verify token
 * @param {token} req
 * @param {*} res
 * @param {*} next
 */

exports.verifyToken = function (req, res, next) {
  let accessToken = req.headers.authorization
  let ip_data =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.client.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  req.ip_data = ip_data
  req.body.Authorization = accessToken
  let request = new Request(req)
  let response = new Response(res)
  if (accessToken) {
    const token = accessToken.split(' ')[1]
    if (token) {
      /*verify token*/
      oauth
        .authenticate(request, response)
        .then(async function (token) {
          res.locals.oauth = { token: token }
          req.User = token.user
          next()
        })
        .catch((error) => {
          UnauthorizedResponse(res, error.message)
        })
    } else {
      UnauthorizedResponse(res, ERROR_MESSAGES.AUTHORIZATION_REQUIRED)
    }
  } else {
    UnauthorizedResponse(res, ERROR_MESSAGES.AUTHORIZATION_REQUIRED)
  }
}

/**
 *
 * verify token
 * @param {token} req
 * @param {*} res
 * @param {*} next
 */

exports.verifyTokenAdmin = function (req, res, next) {
  let accessToken = req.headers.authorization
  let ip_data =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.client.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null)
  req.ip_data = ip_data
  req.body.Authorization = accessToken
  let request = new Request(req)
  let response = new Response(res)
  if (accessToken) {
    const token = accessToken.split(' ')[1]
    if (token) {
      /*verify token*/
      oauth
        .authenticate(request, response)
        .then(async function (token) {
          if (token.user.role !== 'admin') {
            return UnauthorizedResponse(res, ERROR_MESSAGES.AUTHORIZATION_TOKEN_ACCESS_DENIED)
          }
          res.locals.oauth = { token: token }
          req.User = token.user
          next()
        })
        .catch((error) => {
          UnauthorizedResponse(res, error.message)
        })
    } else {
      UnauthorizedResponse(res, ERROR_MESSAGES.AUTHORIZATION_REQUIRED)
    }
  } else {
    UnauthorizedResponse(res, ERROR_MESSAGES.AUTHORIZATION_REQUIRED)
  }
}
