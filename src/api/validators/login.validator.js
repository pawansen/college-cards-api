const Joi = require('joi')

const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string().min(6).max(20).required(),
  client_id: Joi.string().allow('').optional(),
  client_secret: Joi.string().allow('').optional(),
  grant_type: Joi.string().allow('').optional(),
  username: Joi.string().allow('').optional(),
  deviceType: Joi.string().valid('android', 'ios').required(),
  deviceToken: Joi.string().allow('').optional(),
})

module.exports = loginSchema
