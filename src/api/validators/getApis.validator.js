const Joi = require('joi')
const getApis = Joi.object({
  event: Joi.string().required(),
})

module.exports = getApis
