const {
    loginServices,
    registerServices
} = require('../../../../services/mainServices'),
    {
        ErrorResponse,
        SuccessResponse,
        SuccessCreated,
    } = require('../../../../utils/apiResponse');

/**
 * login.
 *
 * @returns {Object}
 */
exports.loginController = (req, res) => {
    req.body.grant_type = 'password'
    loginServices(req, res)
        .then((response) => {
            if (response.status) {
                SuccessResponse(res, response.message, response.data)
            } else {
                ErrorResponse(res, response.message)
            }
        })
        .catch((err) => {
            ErrorResponse(res, err)
        })
}

/**
 * add user.
 *
 * @returns {Object}
 */
exports.registerController = (req, res) => {
    registerServices(req)
        .then((response) => {
            if (response.status) {
                SuccessResponse(res, response.message, response.data)
            } else {
                ErrorResponse(res, response.message)
            }
        })
        .catch((err) => {
            ErrorResponse(res, err.message)
        })
}
