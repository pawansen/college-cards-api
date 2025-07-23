const Validator = require('../../middlewares/validator'),
    { verifyToken } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, registerController, stateController, citiesController
    } = require('../../controllers/v1/app/main/mainController')

class MainRoutes {
    constructor(app) {
        this.app = app
    }
    /* creating app Routes starts */
    appMainRoutes() {

        /** login */
        this.app.post('/v1/login', Validator('login'), loginController)

        /** add user */
        this.app.post(
            '/v1/register',
            Upload('users').single('profileImage'),
            Validator('addUser'),
            registerController
        )

        /** add user */
        this.app.get(
            '/v1/states',
            verifyToken,
            stateController
        )

        /** add user */
        this.app.get(
            '/v1/cities',
            verifyToken,
            // Validator('getCities'),
            citiesController
        )
    }
    routesConfig() {
        this.appMainRoutes()
    }
}
module.exports = MainRoutes