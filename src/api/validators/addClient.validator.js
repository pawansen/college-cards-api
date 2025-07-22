const Joi = require('joi')
const addClient = Joi.object({
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
  city: Joi.string().required(),
  user_type: Joi.string().valid('client'),
  country_id: Joi.number().allow('').optional(),
  state_id: Joi.number().required(),
  city_id: Joi.number().required(),
  state: Joi.string().required(),
  purchase_date: Joi.string().allow('').optional(),
  role_id: Joi.number().required(),
  email: Joi.string().email({ tlds: { allow: false } }),
  profile_image: Joi.string().allow('').optional(),
  birthDate: Joi.string().allow('').optional(),
  address: Joi.string().allow('').optional(),
  is_active: Joi.number().allow('').optional(),
  Authorization: Joi.string().allow('').optional(),
  pan: Joi.string()
    .regex(/^([A-Z]{5}[0-9]{4}[A-Z]{1})?$/)
    .rule({ message: 'Invalid Pan Number' }),
  aadhar: Joi.string()
    .regex(/^[0-9]{12}$/)
    .rule({ message: 'Invalid Aadhar Number' }),
  registration_certificate: Joi.string().allow('').optional(),
  driving_license: Joi.string().allow('').optional(),
  vehicle_id: Joi.number().required(),
  dealer_id: Joi.number().allow('').optional(),
  oem_id: Joi.number().allow('').optional(),
})

module.exports = addClient