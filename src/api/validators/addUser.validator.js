const Joi = require('joi')
const addUser = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .message('Password min length is 6')
    .max(20)
    .message('Password max length is 20')
    .required(),
  mobile: Joi.string()
    .min(5)
    .message('Mobile min length is 5')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),
  deviceId: Joi.string().required(),
  deviceType: Joi.string().valid('android', 'ios').required(),
  deviceToken: Joi.string().required(),
  profileImage: Joi.string().allow('').optional(),
  referralCode: Joi.string().allow('').optional()
})

module.exports = addUser
