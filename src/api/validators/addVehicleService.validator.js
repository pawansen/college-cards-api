const Joi = require('joi')
const addVehicleService = Joi.object({
    vehicle_id: Joi.number().required(),
    book_date: Joi.string().required(),
    ride_km: Joi.string().required(),
    service_type: Joi.string().required(),
    amount: Joi.number().allow('').optional(),
    Authorization: Joi.string().allow('').optional(),
})
module.exports = addVehicleService
