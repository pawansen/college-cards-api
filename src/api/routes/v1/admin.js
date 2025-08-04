const Validator = require('../../middlewares/validator'),
    { verifyToken, verifyTokenAdmin } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, stateController, citiesController, getProfileController,
        updateUserController, addCouponController, addPackageController, getUserController,
        getCouponController, deleteCouponController, getUserInfoController,
        getUserActiveSubscribeController, getUserFeedbackController, addFeedbackReplayController,
        getFeedbackController, getFeedbackInfoController
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
        this.app.post(
            '/v1/admin/add-coupon',
            verifyTokenAdmin,
            Upload('coupon').single('couponLogo'),
            Validator('addCouponAdmin'),
            addCouponController
        )


        /** apis */
        this.app.get(
            '/v1/admin/get-coupons',
            verifyTokenAdmin,
            getCouponController
        )

        /** apis */
        this.app.post(
            '/v1/admin/delete-coupon',
            verifyTokenAdmin,
            Validator('deleteCouponAdmin'),
            deleteCouponController
        )


        /** apis */
        this.app.get(
            '/v1/admin/get-user-info',
            verifyTokenAdmin,
            Validator('getUserProfile'),
            getUserInfoController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-user-subscribes',
            verifyTokenAdmin,
            Validator('getUserProfile'),
            getUserActiveSubscribeController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-user-feedback',
            verifyTokenAdmin,
            Validator('getUserProfile'),
            getUserFeedbackController
        )

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

        /** apis */
        this.app.post(
            '/v1/admin/add-feedback-replay',
            verifyTokenAdmin,
            Validator('addFeedbackReplay'),
            addFeedbackReplayController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-all-feedback',
            verifyTokenAdmin,
            getFeedbackController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-feedback-info',
            verifyTokenAdmin,
            Validator('getFeedbackInfo'),
            getFeedbackInfoController
        )
    }
    routesConfig() {
        this.appAdminRoutes()
    }
}
module.exports = AdminRoutes