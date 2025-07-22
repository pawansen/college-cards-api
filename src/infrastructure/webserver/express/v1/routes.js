const MainRoute = require('../../../../api/routes/v1/main')
class Routes {
  constructor(app) {
    this.app = app
  }
  /* creating app Routes starts */
  appRoutes() {
    /** User root */
    new MainRoute(this.app).routesConfig()
  }
  routesConfig() {
    this.appRoutes()
  }
}
module.exports = Routes
