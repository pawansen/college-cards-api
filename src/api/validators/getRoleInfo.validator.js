const Joi = require('joi')
const getRoleInfoSchema = Joi.object({
  id: Joi.number().required(),
})
module.exports = getRoleInfoSchema
