const Joi = require('joi')
const addInsuranceUser = Joi.object({
    name: Joi.string().required(),
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
    country_id: Joi.number().allow('').optional(),
    state_id: Joi.number().required(),
    city_id: Joi.number().required(),
    state: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }),
    address: Joi.string().allow('').optional(),
    is_active: Joi.number().allow('').optional(),
    oem_id: Joi.number().allow('').optional(),
    dealer_id: Joi.number().allow('').optional(),
    Authorization: Joi.string().allow('').optional(),
})

module.exports = addInsuranceUser
