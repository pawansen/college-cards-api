const Validator = require('../../middlewares/validator'),
    { verifyToken, verifyTokenAdmin } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, stateController, citiesController, getProfileController,
        updateUserController, addCouponController, addPackageController, getUserController
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
            verifyTokenAdmin,
            stateController
        )

        /** apis */
        this.app.get(
            '/v1/admin/cities',
            verifyTokenAdmin,
            // Validator('getCities'),
            citiesController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-profile',
            verifyTokenAdmin,
            getProfileController
        )

        /** apis */
        this.app.post(
            '/v1/admin/update-profile',
            verifyTokenAdmin,
            Upload('users').single('profileImage'),
            Validator('updateUserProfile'),
            updateUserController
        )

        /** apis */
        this.app.post(
            '/v1/admin/add-coupon',
            verifyTokenAdmin,
            Upload('coupon').single('couponLogo'),
            Validator('addCoupon'),
            addCouponController
        )

        /** apis */
        this.app.post(
            '/v1/admin/add-package',
            verifyTokenAdmin,
            Validator('addPackage'),
            addPackageController
        )


        /** apis */
        this.app.get(
            '/v1/admin/get-users',
            verifyTokenAdmin,
            getUserController
        )
    }
    routesConfig() {
        this.appAdminRoutes()
    }
}
module.exports = AdminRoutes