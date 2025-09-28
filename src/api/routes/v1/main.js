const Validator = require('../../middlewares/validator'),
    { verifyToken } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, registerController, stateController, citiesController, getProfileController,
        updateUserController, updateCityController, getCouponController, changePasswordController,
        logoutController, feedbackController, getPackageController, userSubscribeController, getUserSubscribeController,
        getPaymentHistoryController, getRefreshTokenController, getReferralController, getNotificationController, getUserFeedbackController,
        getVersionController, contactUsController,
        forgotPasswordController, verifyOtpController, deleteAccountController, getContentController, getValidateInfoController,
        cancelMembershipController, getRestaurantsLogoListController
    } = require('../../controllers/v1/app/main/mainController'),
    { getCountriesController } = require('../../controllers/v1/app/admin/adminController');

class MainRoutes {
    constructor(app) {
        this.app = app
    }
    /* creating app Routes starts */
    appMainRoutes() {

        /** login */
        this.app.post('/v1/login', Validator('login'), loginController)

        /** apis */
        this.app.post(
            '/v1/register',
            Upload('users').single('profileImage'),
            Validator('addUser'),
            registerController
        )

        /** apis */
        this.app.post(
            '/v1/get-refresh-token',
            getRefreshTokenController
        )

        /** apis */
        this.app.get(
            '/v1/states',
            verifyToken,
            stateController
        )

        /** apis */
        this.app.get(
            '/v1/cities',
            verifyToken,
            // Validator('getCities'),
            citiesController
        )

        /** apis */
        this.app.get(
            '/v1/get-profile',
            verifyToken,
            getProfileController
        )

        /** apis */
        this.app.post(
            '/v1/update-city',
            verifyToken,
            Validator('updateCity'),
            updateCityController
        )

        /** apis */
        this.app.post(
            '/v1/update-profile',
            verifyToken,
            Upload('users').single('profileImage'),
            Validator('updateUserProfile'),
            updateUserController
        )

        /** apis */
        this.app.get(
            '/v1/get-coupons',
            verifyToken,
            getCouponController
        )

        /** apis */
        this.app.post(
            '/v1/change-password',
            verifyToken,
            Validator('changePassword'),
            changePasswordController
        )

        /** apis */
        this.app.post(
            '/v1/logout',
            verifyToken,
            logoutController
        )

        /** apis */
        this.app.post(
            '/v1/add-feedback',
            verifyToken,
            Validator('addFeedback'),
            feedbackController
        )

        /** apis */
        this.app.get(
            '/v1/get-package',
            verifyToken,
            getPackageController
        )

        /** apis */
        this.app.post(
            '/v1/user-subscribe',
            verifyToken,
            Validator('userSubscribe'),
            userSubscribeController
        )

        /** apis */
        this.app.get(
            '/v1/get-user-subscribe',
            verifyToken,
            getUserSubscribeController
        )

        /** apis */
        this.app.get(
            '/v1/get-payment-history',
            verifyToken,
            getPaymentHistoryController
        )

        /** apis */
        this.app.get(
            '/v1/get-referrals',
            verifyToken,
            getReferralController
        )
        /** apis */
        this.app.get(
            '/v1/get-notifications',
            verifyToken,
            getNotificationController
        )

        /** apis */
        this.app.get(
            '/v1/get-user-feedback',
            verifyToken,
            getUserFeedbackController
        )

        /** apis */
        this.app.get(
            '/v1/get-version',
            verifyToken,
            getVersionController
        )

        /** apis */
        this.app.post(
            '/v1/forgot-password',
            Validator('forgotPassword'),
            forgotPasswordController
        )
        /** apis */
        this.app.post(
            '/v1/contact-us',
            contactUsController
        )
        /** apis */
        this.app.post(
            '/v1/verify-otp-change-password',
            Validator('verifyOtp'),
            verifyOtpController
        )

        /** apis */
        this.app.post(
            '/v1/delete-account',
            verifyToken,
            deleteAccountController
        )

        /** apis */
        this.app.get(
            '/v1/get-content',
            Validator('getContent'),
            getContentController
        )

        /** login */
        this.app.get('/v1/get-validate-info', verifyToken, getValidateInfoController)

        /** apis */
        this.app.post(
            '/v1/cancel-membership',
            verifyToken,
            cancelMembershipController
        )

        /** apis */
        this.app.get(
            '/v1/countries',
            getCountriesController
        )

        /** apis */
        this.app.get(
            '/v1/get-restaurants-logo-list',
            getRestaurantsLogoListController
        )

        /** apis */
        this.app.get(
            '/v1/get-cities',
            citiesController
        )

    }
    routesConfig() {
        this.appMainRoutes()
    }
}
module.exports = MainRoutes