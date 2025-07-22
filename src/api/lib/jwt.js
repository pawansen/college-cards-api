const jwt = require('jsonwebtoken'),
  e = require('../../infrastructure/env'),
  { log } = require('../lib/logger'),
  privateKey = e.env.JWT_SECRET

/**
 * jwt signin
 * @param {string} value
 */
exports.sign = async (object) => {
  try {
    const jwtData = {
      expiresIn: e.env.JWT_TIMEOUT_DURATION,
    }
    return jwt.sign(object, privateKey, jwtData)
  } catch (e) {
    log.error(e)
  }
}

/**
 * jwt decode
 * @param {string} value
 */
exports.decode = async (token) => {
  try {
    const decoded = jwt.verify(token, privateKey)
    return decoded
  } catch (error) {
    return {
      valid: false,
      expired: error,
      decoded: null,
    }
  }
}
