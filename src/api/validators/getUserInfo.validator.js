const Joi = require('joi')

const userInfoSchema = Joi.object({
  id: Joi.number().required(),
})

module.exports = userInfoSchema
