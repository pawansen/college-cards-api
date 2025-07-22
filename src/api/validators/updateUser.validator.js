const Joi = require('joi')
const updateUser = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  username: Joi.string()
    .min(3)
    .message('User Name min length is 3')
    .max(12)
    .message('User Name max length is 12')
    .pattern(new RegExp(/^[A-Za-z0-9-_.]+$/))
    .message(
      'User Name should be in valid format. [A-Z a-z 0-9 -_. are allowed]'
    )
    .lowercase()
    .trim()
    .required(),
  password: Joi.string().allow('').optional(),
  mobile: Joi.string()
    .min(10)
    .message('Mobile min length is 10')
    .max(10)
    .message('Mobile max length is 10')
    .required(),
  city: Joi.string().required(),
  country_id: Joi.number().allow('').optional(),
  state_id: Joi.number().required(),
  city_id: Joi.number().required(),
  state: Joi.string().required(),
  role_id: Joi.number().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  profile_image: Joi.string().allow('').optional(),
  birthDate: Joi.string().allow('').optional(),
  oem_id: Joi.number().allow('').optional(),
  address: Joi.string().allow('').optional(),
  is_active: Joi.number().allow('').optional(),
  Authorization: Joi.string().allow('').optional(),
  user_type: Joi.string().valid('vaow', 'oem', 'dealer'),
})

module.exports = updateUser
