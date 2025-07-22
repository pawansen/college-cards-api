const { STATUS_CODE } = require('../../../config/constants')

/** success created */
exports.SuccessCreated = (res, msg) => {
  const dataRes = {
    statusCode: 1,
    message: msg,
  }
  return res.status(STATUS_CODE.SUCCESS_CODE).json(dataRes)
}

/** success response with data */
exports.SuccessResponse = (res, msg, data) => {
  const dataRes = {
    statusCode: 1,
    message: msg,
    data: data,
  }
  return res.status(STATUS_CODE.SUCCESS_CODE).json(dataRes)
}

/** success response with data */
exports.FailedResponse = (res, msg) => {
  const dataRes = {
    statusCode: 0,
    message: msg,
    data: {},
  }
  return res.status(STATUS_CODE.SUCCESS_CODE).json(dataRes)
}

/** success response with data */
exports.SuccessResponseWithOutData = (res, msg) => {
  const dataRes = {
    statusCode: 1,
    message: msg,
  }
  return res.status(STATUS_CODE.SUCCESS_CODE).json(dataRes)
}

/** error code */
exports.ErrorResponse = (res, msg) => {
  const dataRes = {
    statusCode: 0,
    message: msg,
  }
  return res.status(STATUS_CODE.FAIL_CODE).json(dataRes)
}

/** not found code */
exports.NotFoundResponse = (res, msg) => {
  const dataRes = {
    statusCode: 0,
    message: msg,
    data: [],
  }
  return res.status(STATUS_CODE.NOT_FOUND_CODE).json(dataRes)
}

/** not found code */
exports.ValidationErrorWithData = (res, msg, data) => {
  const dataRes = {
    statusCode: 0,
    message: msg,
    data: data,
  }
  return res.status(STATUS_CODE.REQUIRE_PARAMETER).json(dataRes)
}

/** for token expire */
exports.UnauthorizedResponse = (res, msg) => {
  const dataRes = {
    statusCode: 2,
    message: msg,
  }
  return res.status(STATUS_CODE.UNAUTHORIZED_CODE).json(dataRes)
}

/** not found code */
exports.UserExistsError = (res, msg) => {
  const dataRes = {
    statusCode: 0,
    message: msg,
  }
  return res.status(STATUS_CODE.USER_EXISTS).json(dataRes)
}
