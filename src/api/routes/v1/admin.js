const Validator = require('../../middlewares/validator'),
    { verifyToken } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, registerController, stateController, citiesController, getProfileController,
        updateUserController, updateCityController, addCouponController
    } = require('../../controllers/v1/app/admin/adminController')

class AdminRoutes {
    constructor(app) {
        this.app = app
    }
    /* creating app Routes starts */
    appAdminRoutes() {

        /** login */
        this.app.post('/v1/admin/login', Validator('login'), loginController)

        /** apis */
        this.app.get(
            '/v1/admin/states',
            verifyToken,
            stateController
        )

        /** apis */
        this.app.get(
            '/v1/admin/cities',
            verifyToken,
            // Validator('getCities'),
            citiesController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-profile',
            verifyToken,
            getProfileController
        )

        /** apis */
        this.app.post(
            '/v1/admin/update-profile',
            verifyToken,
            Upload('users').single('profileImage'),
            Validator('updateUserProfile'),
            updateUserController
        )

        /** apis */
        this.app.post(
            '/v1/admin/add-coupon',
            verifyToken,
            Upload('coupon').single('couponLogo'),
            Validator('addCoupon'),
            addCouponController
        )
    }
    routesConfig() {
        this.appAdminRoutes()
    }
}
module.exports = AdminRoutes