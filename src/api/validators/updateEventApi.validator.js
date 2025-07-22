const Joi = require('joi')

const updateEventApisSchema = Joi.object({
  event: Joi.string().valid('SportsApi', 'SeriesApi', 'MatchesApi').required(),
  api_url: Joi.string().required(),
  is_active: Joi.number().required(),
  timeout: Joi.number().allow('').optional(),
  Authorization: Joi.string().allow('').optional(),
  id: Joi.number().required(),
})

module.exports = updateEventApisSchema
