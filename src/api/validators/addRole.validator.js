const Joi = require('joi')
const addRole = Joi.object({
  role_name: Joi.string().required(),
  description: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
  permission_module: Joi.string().required(),
  // permission_module: Joi.array()
  //   .items(
  //     Joi.object({
  //       module_id: Joi.number().required(),
  //       can_view: Joi.number().allow('').optional(),
  //       can_insert: Joi.number().allow('').optional(),
  //       can_modify: Joi.number().allow('').optional(),
  //       can_delete: Joi.number().allow('').optional(),
  //     })
  //   )
  //   .required(),
})

module.exports = addRole
