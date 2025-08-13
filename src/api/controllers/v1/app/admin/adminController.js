const {
    loginServices,
    registerServices,
    stateServices,
    citiesServices,
    getProfileServices,
    updateUserServices,
    updateCityServices,
    addCouponServices,
    addPackageServices,
    getUserServices,
    getCouponServices,
    deleteCouponServices,
    getUserInfoServices,
    getUserActiveSubscribeServices,
    getUserFeedbackServices,
    addFeedbackReplayServices,
    getFeedbackServices,
    getFeedbackInfoServices,
    updateVersionServices,
    addUpdateCityServices,
    getCountriesServices,
    getStatesServices,
    getCitiesServices,
    getUpdateCityServices,
    getNotificationServices,
    addPromoCodeServices,
    getPromoCodeServices,
    deletePromoCodeServices,
    addContentServices
} = require('../../../../services/adminService'),
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
exports.addPackageController = (req, res) => {
    addPackageServices(req)
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
exports.getUserController = (req, res) => {
    getUserServices(req)
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
exports.deleteCouponController = (req, res) => {
    deleteCouponServices(req)
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
exports.getUserInfoController = (req, res) => {
    getUserInfoServices(req)
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
exports.getUserActiveSubscribeController = (req, res) => {
    getUserActiveSubscribeServices(req)
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
exports.addFeedbackReplayController = (req, res) => {
    addFeedbackReplayServices(req)
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
exports.getFeedbackController = (req, res) => {
    getFeedbackServices(req)
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
exports.getFeedbackInfoController = (req, res) => {
    getFeedbackInfoServices(req)
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
exports.updateVersionController = (req, res) => {
    updateVersionServices(req)
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
exports.getCountriesController = (req, res) => {
    getCountriesServices(req)
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
exports.getStatesController = (req, res) => {
    getStatesServices(req)
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
exports.getCitiesController = (req, res) => {
    getCitiesServices(req)
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
exports.addUpdateCityController = (req, res) => {
    addUpdateCityServices(req)
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
exports.getUpdateCityController = (req, res) => {
    getUpdateCityServices(req)
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


/**
 * add user.
 *
 * @returns {Object}
 */
exports.addPromoCodeController = (req, res) => {
    addPromoCodeServices(req)
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
exports.getPromoCodeController = (req, res) => {
    getPromoCodeServices(req)
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
exports.deletePromoCodeController = (req, res) => {
    deletePromoCodeServices(req)
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
exports.addContentController = (req, res) => {
    addContentServices(req)
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