const MainRoute = require('../../../../api/routes/v1/main')
const AdminRoute = require('../../../../api/routes/v1/admin')
class Routes {
  constructor(app) {
    this.app = app
  }
  /* creating app Routes starts */
  appRoutes() {
    /** User root */
    new MainRoute(this.app).routesConfig()

    /** Admin root */
    new AdminRoute(this.app).routesConfig()
  }
  routesConfig() {
    this.appRoutes()
  }
}
module.exports = Routes
