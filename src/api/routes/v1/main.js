const Validator = require('../../middlewares/validator'),
    { verifyToken } = require('../../middlewares/verifyToken'),
    Upload = require('../../middlewares/upload'),
    {
        loginController, registerController,
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
            Validator('addUser'),
            registerController
        )
    }
    routesConfig() {
        this.appMainRoutes()
    }
}
module.exports = MainRoutes