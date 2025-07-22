// other imports...
const csvtojson = require('csvtojson'),
  fs = require('fs'),
  db = require('../../../../config/db'),
  { log } = require('../../lib/logger'),
  { TABLES } = require('../../../../config/constants')

let allTables = {
  // [TABLES.COUNTRIES]: db.Countries,
  // [TABLES.STATES]: db.States,
  //[TABLES.CITIES]: db.Cities,
  // [TABLES.GLOBAL_SETTING]: db.GlobalSettings,
  //[TABLES.ROLES]: db.role,
  //[TABLES.MODULE_PERMISSION]: db.modulePermission,
  //[TABLES.ROLES_PERMISSION]: db.rolePermission,
  // [TABLES.OAUTH_CIENT]: db.OAuthClient,
  // [TABLES.OAUTH_TOKENS]: db.OAuthToken,
  // [TABLES.USER_LOGS]: db.UserLogs,
  //[TABLES.PREDICTIONS]: db.Predictions,
  //[TABLES.USER]: db.user,
  // [TABLES.VEHICLES]: db.Vehicle,
  //[TABLES.CHARGING_STATIONS]: db.ChargingStation,
  //[TABLES.ACTUAL_PREDICTIONS]: db.actualPredictions,
  //[TABLES.BASELINE_PREDICTIONS]: db.baselinePredictions,
  //[TABLES.STANDARD_PREDICTIONS_SOH]: db.standardPredictionSoh,
  //[TABLES.PREDICTIONS_SOH]: db.predictionSoh,
}
try {
  for (const [table, model] of Object.entries(allTables)) {
    if (table !== undefined) {
      let filePath = 'data/' + table + '.csv'
      console.log(filePath)
      fs.readFile(filePath, async (err, data) => {
        if (err) console.error(err)
        if (!err && data) {
          await csvtojson()
            .fromFile(filePath)
            .then(async (source) => {
              await db.sequelize.transaction(async function (transaction) {
                await model
                  .bulkCreate(source, { transaction: transaction })
                  .then((data) => {
                    log.info(
                      `Records inserted into ${table} database successfully from ${table}.csv`
                    )
                  })
              })
            })
        }
      })
    }
  }
} catch (err) {
  console.log(err)
}

const importSportApis = async () => {
  try {
    let filePath = 'data/' + TABLES.SPORTS_API + '.csv'
    fs.readFile(filePath, (err, data) => {
      if (err) console.error(err)
      if (!err && data) {
        csvtojson()
          .fromFile(filePath)
          .then((source) => {
            db.sequelize.transaction(async function (transaction) {
              db.SportsApi.bulkCreate(
                source,
                {
                  fields: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  updateOnDuplicate: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  ignoreDuplicates: true,
                },
                { transaction: transaction }
              ).then((data) => {
                log.info(
                  `Records inserted into ${TABLES.SPORTS_API} database successfully from ${TABLES.SPORTS_API}.csv`
                )
              })
            })
          })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
const importSeriesApi = async () => {
  try {
    let filePath = 'data/' + TABLES.SERIES_API + '.csv'
    fs.readFile(filePath, (err, data) => {
      if (err) console.error(err)
      if (!err && data) {
        csvtojson()
          .fromFile(filePath)
          .then((source) => {
            db.sequelize.transaction(async function (transaction) {
              db.SportsApi.bulkCreate(
                source,
                {
                  fields: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  updateOnDuplicate: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  ignoreDuplicates: true,
                },
                { transaction: transaction }
              ).then((data) => {
                log.info(
                  `Records inserted into ${TABLES.SERIES_API} database successfully from ${TABLES.SERIES_API}.csv`
                )
              })
            })
          })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
const importMatchesApi = async () => {
  try {
    let filePath = 'data/' + TABLES.MATCHES_API + '.csv'
    fs.readFile(filePath, (err, data) => {
      if (err) console.error(err)
      if (!err && data) {
        csvtojson()
          .fromFile(filePath)
          .then((source) => {
            db.sequelize.transaction(async function (transaction) {
              db.SportsApi.bulkCreate(
                source,
                {
                  fields: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  updateOnDuplicate: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  ignoreDuplicates: true,
                },
                { transaction: transaction }
              ).then((data) => {
                log.info(
                  `Records inserted into ${TABLES.MATCHES_API} database successfully from ${TABLES.MATCHES_API}.csv`
                )
              })
            })
          })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
const importMarketApi = async () => {
  try {
    let filePath = 'data/' + TABLES.MARKET_API + '.csv'
    fs.readFile(filePath, (err, data) => {
      if (err) console.error(err)
      if (!err && data) {
        csvtojson()
          .fromFile(filePath)
          .then((source) => {
            db.sequelize.transaction(async function (transaction) {
              db.SportsApi.bulkCreate(
                source,
                {
                  fields: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  updateOnDuplicate: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  ignoreDuplicates: true,
                },
                { transaction: transaction }
              ).then((data) => {
                log.info(
                  `Records inserted into ${TABLES.MARKET_API} database successfully from ${TABLES.MARKET_API}.csv`
                )
              })
            })
          })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
const importMarketSelectionApi = async () => {
  try {
    let filePath = 'data/' + TABLES.MARKET_SELECTION + '.csv'
    fs.readFile(filePath, (err, data) => {
      if (err) console.error(err)
      if (!err && data) {
        csvtojson()
          .fromFile(filePath)
          .then((source) => {
            db.sequelize.transaction(async function (transaction) {
              db.SportsApi.bulkCreate(
                source,
                {
                  fields: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  updateOnDuplicate: [
                    'function_name',
                    'api_url',
                    'is_active',
                    'order_by',
                    'is_default',
                    'timeout',
                    'ids_required',
                  ],
                  ignoreDuplicates: true,
                },
                { transaction: transaction }
              ).then((data) => {
                log.info(
                  `Records inserted into ${TABLES.MARKET_SELECTION} database successfully from ${TABLES.MARKET_SELECTION}.csv`
                )
              })
            })
          })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
// importSportApis()
// importSeriesApi()
// importMatchesApi()
// importMarketApi()
// importMarketSelectionApi()
