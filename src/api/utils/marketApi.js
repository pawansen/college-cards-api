const axios = require('axios'),
  moment = require('moment-timezone'),
  { getEventApiServices } = require('../services/eventServices'),
  CONSTANTS = require('../../../config/constants'),
  { settings } = require('../services/settingServices'),
  { showLogs } = require('../controllers/v1/app/setting/settingController'),
  { log } = require('../lib/logger')

module.exports = {
  developer: async function (params, url, timeout = 3000) {
    try {
      let markets = [],
        market_selections = [],
        marketsLog = '',
        selectionsLog = ''
      let response = await axios.get(url, { timeout })
      response = response.data
      if (response.length) {
        let only_markets = await settings(
          'selected_markets,import_default_active'
        )
        if (only_markets.length) only_markets = only_markets[0]
        let isHrGHr
        // This condition is specifically for Hourse racing & GreyHond racing.
        if (
          [CONSTANTS.API.HORSE_RACING, CONSTANTS.API.GREYHOUND_RACING].includes(
            params.sport_id
          )
        ) {
          isHrGHr = {
            competition: { id: params.sport_id, name: params.sport_name },
          }
          if (Array.isArray(response)) {
            let match_odds = JSON.parse(
              JSON.stringify(response[response.length - 1])
            )
            match_odds.marketName = CONSTANTS.API.MATCH_ODDS
            match_odds.marketId = `${match_odds.marketId}_m`
            response.push(match_odds)
            response = response.map((data) => ({ ...data, ...isHrGHr }))
          } else response = []
        } else {
          if (only_markets.selected_markets.length) {
            let onlySelectedMarkets = only_markets.selected_markets.split(',')
            if (Array.isArray(response))
              response = response.filter((data) =>
                onlySelectedMarkets.includes(data.marketName)
              )
            else response = []
          }
        }
        createBookmaker(params, response)
        response.map(async (data) => {
          markets.push({
            sport_id: data.eventType.id,
            series_id: data.competition.id,
            match_id: data.event.id,
            market_id: data.marketId,
            marketStartTime: data.marketStartTime,
            totalMatched: data.totalMatched,
            name: data.marketName,
            is_active: only_markets.import_default_active,
            sport_name: params.sport_name,
            sport_is_active: params.sport_is_active,
            series_name: params.series_name,
            series_is_active: params.series_is_active,
            series_is_completed: params.series_is_completed,
            match_name: params.name, // match_name
            match_is_active: params.is_active, // match_is_active
            match_date: isHrGHr
              ? moment(data.marketStartTime).format('YYYY-MM-DD HH:mm:ss')
              : params.match_date, // match_date
            match_is_completed: params.is_completed, // match_is_completed
            centralId: 1, // centralId
            country_code: data?.event?.countryCode,
            venue: data?.event?.venue,
          })
          if (data.runners.length) {
            data.runners.map(async (runner) => {
              market_selections.push({
                match_id: data.event.id,
                market_id: data.marketId,
                selection_id: runner.selectionId,
                name: runner.runnerName,
                sort_priority: runner.sortPriority,
                metadata:
                  runner.hasOwnProperty('metadata') &&
                  [CONSTANTS.API.HORSE_RACING].includes(params.sport_id)
                    ? runner.metadata
                      ? JSON.stringify({
                          JOCKEY_NAME: runner.metadata?.JOCKEY_NAME,
                          TRAINER_NAME: runner.metadata?.TRAINER_NAME,
                          AGE: runner.metadata?.AGE,
                          WEIGHT_VALUE: runner.metadata?.WEIGHT_VALUE,
                          DAYS_SINCE_LAST_RUN:
                            runner.metadata?.DAYS_SINCE_LAST_RUN,
                          WEARING: runner.metadata?.WEARING,
                          CLOTH_NUMBER: runner.metadata?.CLOTH_NUMBER,
                          TRAINER_NAME: runner.metadata?.TRAINER_NAME,
                          COLOURS_FILENAME: runner.metadata?.COLOURS_FILENAME
                            ? `${CONSTANTS.API.COLOURS_FILENAME_URL}${runner.metadata?.COLOURS_FILENAME}`
                            : undefined,
                        })
                      : JSON.stringify({})
                    : JSON.stringify({}),
              })
              selectionsLog += `series[${data.competition.id}],match[${data.event.id}],market[${data.marketId},${data.marketName}],selectionId[${runner.selectionId}]\n`
            })
          }
          marketsLog += `series:(${data.competition.id}),match:(${data.event.id}),market:(${data.marketId},${data.marketName})\n`
        })
        await require('../lib/writeLog.js')['createLog'](
          'import_markets',
          marketsLog
        )
        await require('../lib/writeLog.js')['createLog'](
          'import_selections',
          selectionsLog
        )
        return {
          status: true,
          data: {
            markets,
            market_selections,
          },
        }
      } else
        return {
          status: false,
          data: [],
        }
    } catch (error) {
      console.error('error', error.message)
      await require('../lib/writeLog.js')['createLog'](
        'import_markets',
        `Error:${error.message}`
      )
      return {
        status: false,
        data: error.message,
      }
    }
  },
  ex_7dayexch: async function (params, url, timeout = 2000) {
    return await this.developer(params, url, timeout)
  },
  xcentral: async function (params, url, timeout = 2000) {
    let response = await require('./marketsApiFormat')[params.selected_api](
      url,
      timeout
    )
    return await this.responseExtractAndLogCreate(params, response)
  },
  responseExtractAndLogCreate: async function (params, response) {
    try {
      if (response.length) {
        let markets = [],
          market_selections = [],
          marketsLog = '',
          selectionsLog = ''
        let only_markets = await settings('import_default_active')
        if (only_markets.data.length) only_markets = only_markets.data[0]
        else only_markets = { import_default_active: 0 }
        response.map(async (data) => {
          markets.push([
            data.eventType.id,
            data.competition.id,
            data.event.id,
            data.marketId,
            data.marketStartTime,
            data.totalMatched,
            data.marketName,
            only_markets.import_default_active,
            params.sport_name,
            params.sport_is_active,
            params.series_name,
            params.series_is_active,
            params.series_is_completed,
            params.name, // match_name
            params.is_active, // match_is_active
            params.match_date, // match_date
            params.is_completed, // match_is_completed
            data.centralId, // centralId
          ])
          if (data.runners.length) {
            data.runners.map(async (runner) => {
              market_selections.push([
                data.event.id,
                data.marketId,
                runner.selectionId,
                runner.runnerName,
                runner.sortPriority,
              ])
              selectionsLog += `series[${data.competition.id}],match[${data.event.id}],market[${data.marketId},${data.marketName}],selectionId[${runner.selectionId}]\n`
            })
          }
          marketsLog += `series:(${data.competition.id}),match:(${data.event.id}),market:(${data.marketId},${data.marketName})\n`
        })
        await require('../lib/writeLog.js')['createLog'](
          'import_markets',
          marketsLog
        )
        await require('../lib/writeLog.js')['createLog'](
          'import_selections',
          selectionsLog
        )
        return {
          status: true,
          data: {
            markets,
            market_selections,
          },
        }
      } else
        return {
          status: false,
          data: [],
        }
    } catch (error) {
      await require('../lib/writeLog.js')['createLog'](
        'import_markets',
        `Error:${error.message}`
      )
      return {
        status: false,
        data: error.message,
      }
    }
  },
  selectedMarketsApi: async function (data) {
    let response = []
    return getEventApiServices('markets_api')
      .then(async (selectedApi) => {
        if (selectedApi.length > 0) {
          for (let block = 0; block < selectedApi.length; block++) {
            if (selectedApi[block].function_name == CONSTANTS.API.XCENTRAL)
              if (data.sourceID)
                selectedApi[block].api_url = selectedApi[block].api_url.replace(
                  'SOURCE_ID',
                  data.sourceID
                )
              else
                selectedApi[block].api_url = selectedApi[block].api_url.replace(
                  '&sourceID=SOURCE_ID',
                  ''
                )
            let API_URL = ApiUrlPattern(
              selectedApi[block].api_url,
              selectedApi[block].function_name,
              data
            )
            if (!data.selected_api)
              data.selected_api = selectedApi[block].function_name
            let result = await this[selectedApi[block].function_name](
              data,
              API_URL,
              selectedApi[block].timeout
            )
            if (showLogs)
              log.info(
                `Now seaching markets(${data.match_id})..${selectedApi[block].function_name}`
              )
            if (result.status) {
              response = result
              break
            } else {
              if (showLogs)
                log.error(
                  `Markets(${data.match_id}) Not Found In ${selectedApi[block].function_name} API`
                )
            }
            if (block == selectedApi.length - 1 && !result.data.length)
              response = result
          }
          return response
        } else {
          return {
            status: false,
            data: 'Please Add Market API',
          }
        }
      })
      .catch((err) => {
        return {
          status: false,
          data: err,
        }
      })
  },
}

function ApiUrlPattern(url, functionName, data) {
  switch (functionName) {
    case 'developer':
    case 'ex_7dayexch':
    case 'sa_crakex':
    case CONSTANTS.API.XCENTRAL:
      return url.replace('MATCH_ID', data.match_id)
  }
}

function createBookmaker(params, response) {
  if (params.sport_name == 'Cricket') {
    let bookmaker = response.find((data) => data.marketName == 'Match Odds')
    if (bookmaker) {
      bookmaker = JSON.parse(JSON.stringify(bookmaker))
      bookmaker.marketId = bookmaker.marketId + '12'
      bookmaker.marketName = 'Bookmaker'
      bookmaker.runners = bookmaker.runners.map(
        (data, index) => ((data.selectionId = ++index), data)
      )
      response.push(bookmaker)
    }
  }
}
