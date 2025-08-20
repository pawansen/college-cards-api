const bodyParser = require('body-parser'),
  cors = require('cors'),
  express = require('express'),
  Routes = require('./v1/routes'),
  { log } = require('../../../api/lib/logger'),
  { env } = require('../../env');
mongoose = require('../../../../config/mongoose');
/*const morgan = require('morgan');*/
/** create server module */
exports.createServer = () => {
  const app = express()
  const port = env.APPPORT
  const host = env.HOST

  /* For parsing urlencoded data */
  /*app.use(morgan('dev'));*/
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
  /* To handle invalid JSON data request */
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use('/uploads', express.static('uploads'));

  /** http access log */
  /*app.use(httpLogger)*/

  /** add header */
  // app.use(function (err, req, res, next) {
  //   /*CORS headers*/
  //   const responseSettings = {
  //     //"AccessControlAllowOrigin": req.headers.origin,
  //     AccessControlAllowOrigin: '*',
  //     AccessControlAllowHeaders:
  //       'Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-File-Name, Authorization',
  //     AccessControlAllowMethods: 'POST, GET, PUT, DELETE, OPTIONS',
  //     AccessControlAllowCredentials: 'true',
  //   }
  //   // Set custom headers for CORS
  //   res.header(
  //     'Access-Control-Allow-Origin',
  //     responseSettings.AccessControlAllowOrigin
  //   )
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     req.headers['access-control-request-headers']
  //       ? req.headers['access-control-request-headers']
  //       : 'x-requested-with'
  //   )
  //   res.header(
  //     'Access-Control-Allow-Methods',
  //     req.headers['access-control-request-method']
  //       ? req.headers['access-control-request-method']
  //       : responseSettings.AccessControlAllowMethods
  //   )
  //   if ('OPTIONS' === req.method) {
  //     res.status(200).send(err).end()
  //   } else {
  //     next()
  //   }
  // })

  // Configure CORS to allow requests from your admin website domain
  app.use(cors({
    origin: "https://mycollegecards.com", // your website domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

  new Routes(app).routesConfig()
  /** listen server */
  mongoose.connect()().then(() => {
    app.listen(port, () => {
      log.info(`Server Running on http://${ host }:${ port }`)
    })
  });

  // app.listen(port, () => {
  //   log.info(`Vehicle Running on http://${host}:${port}`)
  // })

}
