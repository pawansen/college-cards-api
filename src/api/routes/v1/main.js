const Validator = require('../../middlewares/validator'),
    { verifyToken } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, registerController, stateController, citiesController, getProfileController,
        updateUserController, updateCityController
    } = require('../../controllers/v1/app/main/mainController')

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
    }
    routesConfig() {
        this.appMainRoutes()
    }
}
module.exports = MainRoutes