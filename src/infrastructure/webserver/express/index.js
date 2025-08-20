import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import Routes from './v1/routes.js';
import { log } from '../../../api/lib/logger.js';
import { env } from '../../env.js';
import mongoose from '../../../../config/mongoose.js';
/*import morgan from 'morgan';*/
/** create server module */
export const createServer = () => {
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

  // Configure CORS to allow requests from your admin website domain
  app.use(cors({
    origin: "https://mycollegecards.com", // your website domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

  // Handle preflight requests for all routes
  app.options('*', cors({
    origin: "https://mycollegecards.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

  new Routes(app).routesConfig()
  /** listen server */
  mongoose.connect().then(() => {
    app.listen(port, () => {
      log.info(`Server Running on http://${ host }:${ port }`)
    })
  });

  // app.listen(port, () => {
  //   log.info(`Vehicle Running on http://${host}:${port}`)
  // })

}
