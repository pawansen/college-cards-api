const Joi = require('joi')

const usersSchema = Joi.object({
  keyword: Joi.string().allow('').optional(),
  limit: Joi.number().required(),
  pageNo: Joi.number().required(),
  filter: Joi.string().allow('').optional(),
  role_id: Joi.string().allow('').optional(),
  oem_id: Joi.string().allow('').optional(),
  parent_id: Joi.string().allow('').optional(),
})

module.exports = usersSchema
