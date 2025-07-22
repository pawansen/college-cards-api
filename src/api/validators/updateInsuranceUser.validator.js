const Joi = require('joi')
const updateInsuranceUser = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
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
    email: Joi.string().email({ tlds: { allow: false } }),
    oem_id: Joi.number().allow('').optional(),
    address: Joi.string().allow('').optional(),
    is_active: Joi.number().allow('').optional(),
    Authorization: Joi.string().allow('').optional(),
})

module.exports = updateInsuranceUser
