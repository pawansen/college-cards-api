const Joi = require('joi')
const updateUserStatus = Joi.object({
  id: Joi.number().required(),
  is_active: Joi.number().valid(1, 0).required(),
  Authorization: Joi.string().allow('').optional(),
})

module.exports = updateUserStatus
