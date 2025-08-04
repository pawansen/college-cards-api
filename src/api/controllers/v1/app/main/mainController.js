const {
    loginServices,
    registerServices,
    stateServices,
    citiesServices,
    getProfileServices,
    updateUserServices,
    updateCityServices,
    addCouponServices,
    getCouponServices,
    changePasswordServices,
    logoutServices,
    feedbackServices,
    getPackageServices,
    userSubscribeServices,
    getUserSubscribeServices,
    getPaymentHistoryServices,
    getRefreshTokenServices,
    getReferralServices,
    getNotificationServices,
    getUserFeedbackServices
} = require('../../../../services/mainServices'),
    {
        ErrorResponse,
        SuccessResponse
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
    registerServices(req, res)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.stateController = (req, res) => {
    stateServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.citiesController = (req, res) => {
    citiesServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.getProfileController = (req, res) => {
    getProfileServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.updateUserController = (req, res) => {
    updateUserServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.updateCityController = (req, res) => {
    updateCityServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.addCouponController = (req, res) => {
    addCouponServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.getCouponController = (req, res) => {
    getCouponServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.changePasswordController = (req, res) => {
    changePasswordServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.logoutController = (req, res) => {
    logoutServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.feedbackController = (req, res) => {
    feedbackServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.getUserFeedbackController = (req, res) => {
    getUserFeedbackServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.getPackageController = (req, res) => {
    getPackageServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.userSubscribeController = (req, res) => {
    userSubscribeServices(req)
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


/**
 * add user.
 *
 * @returns {Object}
 */
exports.getUserSubscribeController = (req, res) => {
    getUserSubscribeServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.getPaymentHistoryController = (req, res) => {
    getPaymentHistoryServices(req)
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


/**
 * add user.
 *
 * @returns {Object}
 */
exports.getRefreshTokenController = (req, res) => {
    getRefreshTokenServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.getReferralController = (req, res) => {
    getReferralServices(req)
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

/**
 * add user.
 *
 * @returns {Object}
 */
exports.getNotificationController = (req, res) => {
    getNotificationServices(req)
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