const mongoose = require('mongoose'),
    { env } = require('../src/infrastructure/env'),
    { log } = require('../src/api/lib/logger');
mongoose.set('strictQuery', false);
exports.connect = function (config = {
    host: env.MONGO_HOST,
    user: env.MONGO_USER,
    password: env.MONGO_PASSWORD,
    database: env.MONGO_DATABASE
}) {
    return async function (cb) {
        let op = {
            maxPoolSize: 300,
            dbName: config.database
        }
        let MONGO_CONNECTION_URL = `mongodb+srv://${config.user}:${config.password}@${config.host}`;
        await mongoose.connect(MONGO_CONNECTION_URL, op)
            .then((res) => {
                console.time('connect')
                log.info(
                    'MongoDB Connected to Distribution API Database - Initial Connection ' + MONGO_CONNECTION_URL + '/' + config.database,
                );
            })
            .catch((err) => {
                console.log(`MongoDB Initial Distribution API Database connection error occured`, err);
                process.exit(1);
            }).finally(() => console.timeEnd('connect'));
    }
}
exports.disconnect = function () {
    mongoose.connection.close().then(() => {
        console.log(`MongoDB disconnected!`);
    }).catch((err) => { console.log(err) })
};
