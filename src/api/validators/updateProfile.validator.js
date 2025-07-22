const Joi = require('joi')
const updateClient = Joi.object({
  name: Joi.string().required(),
  mobile: Joi.string()
    .min(10)
    .message('Mobile min length is 10')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  city: Joi.string().required(),
  country_id: Joi.number().allow('').optional(),
  state_id: Joi.number().required(),
  city_id: Joi.number().required(),
  state: Joi.string().required(),
  profile_image: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  Authorization: Joi.string().allow('').required(),
})

module.exports = updateClient
