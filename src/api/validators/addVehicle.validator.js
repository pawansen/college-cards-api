const Joi = require('joi')
const addVehicle = Joi.object({
  oem_id: Joi.number().required(),
  battery_id: Joi.string().required(),
  bms_id: Joi.string().required(),
  mcu_id: Joi.string().required(),
  bms_firmware: Joi.string().required(),
  iot_id: Joi.string().required(),
  sim_provider: Joi.string().required(),
  sim_number: Joi.string().required(),
  manufacture_date: Joi.string().required(),
  model_name: Joi.string().required(),
  vin_number: Joi.string().required(),
  Authorization: Joi.string().allow('').optional(),
})

module.exports = addVehicle
