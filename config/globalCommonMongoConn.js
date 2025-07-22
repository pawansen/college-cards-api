const sequelize = require('sequelize'),
  db = require('./db'),
  seqConnection = db.sequelize,
  mongoose = require('./mongoose'),
  { env } = require('../src/infrastructure/env'),
  client = require('./redis');

/**
 * 
 * @returns Mongodb GLobal connection
 */
exports.connectMongoDB = async (iot_id, user_id) => {
  return true;
  // client.get("global-db-config", (err, data) => {
  //   if (data) {
  //     console.log('data', JSON.parse(data))
  //   } else {
  //     client.setex("global-db-config", 3600 * 24, JSON.stringify({ 'abc': "12399" }));
  //   }
  // });
  if (iot_id) {
    const query = `SELECT
    UC.user_id,UC.db_name,UC.db_host,UC.db_user,UC.db_password
    FROM
    user_config UC INNER JOIN vehicles V ON V.oem_id=UC.user_id WHERE V.iot_id="${ iot_id }" LIMIT 1;`
    return await seqConnection.query(query, {
      raw: true,
      type: sequelize.QueryTypes.SELECT,
    }).then(async (dbConfig) => {
      if (dbConfig.length > 0) {
        let config = dbConfig[0];
        let password = Buffer.from(config.db_password, 'base64').toString('ascii');
        mongoose
          .connect({
            host: config.db_host,
            user: config.db_user,
            password: password,
            database: config.db_name
          })()
          .then(() => {
          })
      }
    }).catch((err) => {
      console.log(err)
    })
  } else if (user_id) {
    const query = `SELECT
    UC.user_id,UC.db_name,UC.db_host,UC.db_user,UC.db_password
    FROM
    user_config UC WHERE UC.user_id="${ user_id }" LIMIT 1;`
    return await seqConnection.query(query, {
      raw: true,
      type: sequelize.QueryTypes.SELECT,
    }).then(async (dbConfig) => {
      if (dbConfig.length > 0) {
        let config = dbConfig[0];
        let password = Buffer.from(config.db_password, 'base64').toString('ascii');
        mongoose
          .connect({
            host: config.db_host,
            user: config.db_user,
            password: password,
            database: config.db_name
          })()
          .then(() => {
          })
      }
    }).catch((err) => {
      console.log(err)
    })
  } else {
    mongoose
      .connect({
        host: env.MONGO_HOST,
        user: env.MONGO_USER,
        password: env.MONGO_PASSWORD,
        database: env.MONGO_DATABASE
      })()
      .then(() => {
      })
  }
}

/**
 * 
 * @returns Mongodb GLobal connection
 */
exports.connectMongoDBOnLogin = async (iot_id, user_id) => {
  try {
    let ioId = (iot_id != null) ? iot_id : "";
    let uId = (user_id != null) ? user_id : "";
    client.get(`global-db-config-${ ioId }-${ uId }`, async (err, configData) => {
      if (configData) {
        let config = JSON.parse(configData);
        let password = Buffer.from(config.db_password, 'base64').toString('ascii');
        await mongoose
          .connect({
            host: config.db_host,
            user: config.db_user,
            password: password,
            database: config.db_name
          })()
          .then(() => {
          })
      } else {
        if (iot_id) {
          const query = `SELECT
          UC.user_id,UC.db_name,UC.db_host,UC.db_user,UC.db_password
          FROM
          user_config UC INNER JOIN vehicles V ON V.oem_id=UC.user_id WHERE V.iot_id="${ iot_id }" LIMIT 1;`
          return await seqConnection.query(query, {
            raw: true,
            type: sequelize.QueryTypes.SELECT,
          }).then(async (dbConfig) => {
            if (dbConfig.length > 0) {
              let config = dbConfig[0];
              client.setex(`global-db-config-${ ioId }-${ uId }`, 3600 * 24, JSON.stringify(dbConfig[0]));
              let password = Buffer.from(config.db_password, 'base64').toString('ascii');
              await mongoose
                .connect({
                  host: config.db_host,
                  user: config.db_user,
                  password: password,
                  database: config.db_name
                })()
                .then(() => {
                })
            }
          }).catch((err) => {
            console.log(err)
          })
        } else if (user_id) {
          const query = `SELECT
          UC.user_id,UC.db_name,UC.db_host,UC.db_user,UC.db_password
          FROM
          user_config UC WHERE UC.user_id="${ user_id }" LIMIT 1;`
          return await seqConnection.query(query, {
            raw: true,
            type: sequelize.QueryTypes.SELECT,
          }).then(async (dbConfig) => {
            if (dbConfig.length > 0) {
              let config = dbConfig[0];
              client.setex(`global-db-config-${ ioId }-${ uId }`, 3600 * 24, JSON.stringify(dbConfig[0]));
              let password = Buffer.from(config.db_password, 'base64').toString('ascii');
              await mongoose
                .connect({
                  host: config.db_host,
                  user: config.db_user,
                  password: password,
                  database: config.db_name
                })()
                .then(() => {
                })
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          mongoose
            .connect({
              host: env.MONGO_HOST,
              user: env.MONGO_USER,
              password: env.MONGO_PASSWORD,
              database: env.MONGO_DATABASE
            })()
            .then(() => {
            })
        }
      }
    });
  } catch (err) {
    console.log(err)
  }

}