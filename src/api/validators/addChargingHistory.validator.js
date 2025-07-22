const Joi = require('joi')
const addChargingHistory = Joi.object({
    vehicle_id: Joi.number().required(),
    station: Joi.string().required(),
    location: Joi.string().required(),
    distance_covered: Joi.string().required(),
    lat: Joi.string().allow('').optional(),
    long: Joi.string().allow('').optional(),
    start_date_time: Joi.string().allow('').optional(),
    end_date_time: Joi.string().allow('').optional(),
    battery_charg_percentage: Joi.string().required(),
    Authorization: Joi.string().allow('').optional(),
})
module.exports = addChargingHistory
