const Joi = require('joi')
const signup = Joi.object({
  name: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .message('Password min length is 6')
    .max(20)
    .message('Password max length is 20')
    .required(),
  mobile: Joi.string()
    .min(10)
    .message('Mobile min length is 10')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
})

module.exports = signup
