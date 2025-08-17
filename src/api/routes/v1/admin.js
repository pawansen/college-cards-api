const Validator = require('../../middlewares/validator'),
    { verifyToken, verifyTokenAdmin } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, stateController, citiesController, getProfileController,
        updateUserController, addCouponController, addPackageController, getUserController,
        getCouponController, getCouponInfoController, deleteCouponController, getUserInfoController,
        getUserActiveSubscribeController, getUserFeedbackController, addFeedbackReplayController,
        getFeedbackController, getFeedbackInfoController,
        updateVersionController,
        addUpdateCityController,
        getCountriesController,
        getStatesController,
        getCitiesController,
        getUpdateCityController,
        getNotificationController,
        addPromoCodeController,
        getPromoCodeController,
        deletePromoCodeController,
        addContentController,
        getDashboardController,
        userStatusUpdateController
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
            '/v1/admin/add-promo-code',
            verifyTokenAdmin,
            Validator('addPromoCodeAdmin'),
            addPromoCodeController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-promo-code',
            verifyTokenAdmin,
            getPromoCodeController
        )

        /** apis */
        this.app.post(
            '/v1/admin/delete-promo-code',
            verifyTokenAdmin,
            Validator('deletePromoCodeAdmin'),
            deletePromoCodeController
        )

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
        this.app.get(
            '/v1/admin/get-coupon-info',
            verifyTokenAdmin,
            getCouponInfoController
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

        /** apis */
        this.app.post(
            '/v1/admin/update-version',
            verifyTokenAdmin,
            Validator('updateVersion'),
            updateVersionController
        )

        /** apis */
        this.app.get(
            '/v1/admin/countries',
            verifyTokenAdmin,
            getCountriesController
        )

        /** apis */
        this.app.get(
            '/v1/admin/states',
            verifyTokenAdmin,
            getStatesController
        )


        /** apis */
        this.app.get(
            '/v1/admin/cities',
            verifyTokenAdmin,
            getCitiesController
        )


        /** apis */
        this.app.post(
            '/v1/admin/add-update-city',
            verifyTokenAdmin,
            Validator('addUpdateCity'),
            addUpdateCityController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-update-cities',
            verifyTokenAdmin,
            getUpdateCityController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-notifications',
            verifyTokenAdmin,
            getNotificationController
        )

        /** apis */
        this.app.post(
            '/v1/admin/add-content',
            verifyTokenAdmin,
            Validator('addContent'),
            addContentController
        )

        /** apis */
        this.app.get(
            '/v1/admin/get-dashboard',
            verifyTokenAdmin,
            getDashboardController
        )

        /** apis */
        this.app.post(
            '/v1/admin/update-user-status',
            verifyTokenAdmin,
            Validator('userStatusUpdate'),
            userStatusUpdateController
        )

    }
    routesConfig() {
        this.appAdminRoutes()
    }
}
module.exports = AdminRoutes