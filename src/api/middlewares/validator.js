//* Include joi to check error type
;(Joi = require('joi')),
  ({ ErrorResponse, SuccessResponse } = require('../utils/apiResponse')),
  (Validators = require('../validators'))
module.exports = function (validator) {
  //! If validator is not exist, throw err
  if (!Validators.hasOwnProperty(validator))
    throw new Error(`'${validator}' validator is not exist`)

  return async function (req, res, next) {
    try {
      if (req.method === 'GET') {
        const validated = await Validators[validator].validateAsync(req.query, {
          abortEarly: false,
        })
        req.query = validated
      } else {
        const validated = await Validators[validator].validateAsync(req.body, {
          abortEarly: false,
        })
        req.body = validated
      }
      next()
    } catch (err) {
      //* Pass err to next
      if (err.isJoi) ErrorResponse(res, err.details[0].message)
    }
  }
}
