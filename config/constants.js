exports.STATUS_CODE = {
  UNAUTHORIZED_CODE: 401, // for token expire
  NOT_FOUND_CODE: 404, // data not found
  SUCCESS_CODE: 200, // every success request
  FAIL_CODE: 400, // every failed request
  USER_EXISTS: 409,
  REQUIRE_PARAMETER: 422,
  CREATE_SUCCESS_CODE: 201,
}
exports.ERROR_MESSAGES = {
  USER_ID_NOT_FOUND: 'Not Found - User id was not found',
  DATA_NOT_FOUND: 'Not Found - Data',
  AUTHORIZATION_REQUIRED: 'Authorization required',
  AUTHORIZATION_TOKEN_EXPIRED: 'Authorization token expired',
  AUTHORIZATION_TOKEN_INVALID_WITH_USERID:
    'Authorization token not associated with this User Id',
  AUTHORIZATION_TOKEN_ACCESS_DENIED: 'Authorization token access denied',
}
exports.SUCCESS_MESSAGE = {
  OK: 'Ok',
  CREATED: 'Created',
}
exports.LUNGUAGE_SORT = {
  EN: 'en',
}
exports.FIELDS = {
  PAGE_NO: 'page-no',
  PAGE_SIZE: 'page-search-limit',
}
exports.VALIDATON_ERROR_MESSAGES = {
  NOT_VALID: 'is not valid.',
  REQUIRED: 'is require.',
}
exports.ERROR_TYPES = {
  MISSING_REQUEST_PARAMETER: 'MissingRequiredParameterError',
  ASSET_ID_AND_MESUREMENT_ITEM_SET_ID_EXIST:
    'AssetIdandItemsetIdAlreadyExistError',
  FIELD_NOT_VALID: 'FieldValidationError',
  DATA_NOT_FOUND: 'DataNotFoundError',
  USER_ID_EXIST: 'UserIdAlreadyExistError',
}
exports.TABLES = {
  MODULE_PERMISSION: 'module_permissions',
  USER_LOGS: 'user_logs',
  GLOBAL_SETTING: 'global_settings',
  OAUTH_CIENT: 'oauth_client',
  OAUTH_TOKENS: 'oauth_tokens',
  PREDICTIONS: 'predictions',
  VEHICLES: 'vehicles',
  COUNTRIES: 'countries',
  STATES: 'states',
  CITIES: 'cities',
  ROLES: 'roles',
  ROLES_PERMISSION: 'role_permissions',
  USER: 'users',
  CHARGING_HISTORY: 'charging_histories',
  VEHICLE_SERVICES: 'vehicle_services',
  CHARGING_STATIONS: 'charging_stations',
  ACTUAL_PREDICTIONS: 'actual_predictions',
  BASELINE_PREDICTIONS: 'baseline_predictions',
  STANDARD_PREDICTIONS_SOH: 'standard_prediction_soh',
  PREDICTIONS_SOH: 'prediction_soh',
}

exports.API = {
  MIN: 100,
  MAX: 150,
  NOT_FOUND: 1404,
  SERVER_ERROR: 1500,
  VALIDATION_ERROR: 201,
  SUCCESS: 1200,
  ACCESS_DENIED: 1403,
  NOT_VERIFIED: 1405,
  ALREADY_EXISTS: 1406,
  SITE_UNDER_MAINTENANCE: 1407,
  MATCH_ODDS: 'Match Odds',
  ERROR_TRUE: true,
  ERROR_FALSE: false,
  TRUE: true,
  FALSE: false,
  DATA_NULL: null,
  DATA_EMPTY: [],
  ERROR_CODE_TWO: 2,
  ERROR_CODE_ONE: 1,
  ERROR_CODE_ZERO: 0,
  LIMIT: 50,
  MAX_MACTH_LIMIT: 100,
  XCENTRAL: 'xcentral',
  LOCAL_REDIS_IP: '127.0.0.1',
  LIVE_REDIS_IP: '127.0.0.1',
  LOCAL_HOST: '127.0.0.1',
  IMPERSONATE_PASSWORD_ALLOWED_IP: [
    '127.0.0.1',
    '192.168.1.18',
    '192.168.1.21',
    '49.249.249.230',
    '192.168.1.33',
    '150.107.190.4',
    '150.107.190.14',
  ],
  LIVE_GAME_SPORT_ID: -100,
  DIAMOND_GAME_SPORT_ID: '-101',
  GREYHOUND_RACING: '4339',
  HORSE_RACING: '7',
  COLOURS_FILENAME_URL:
    'https://content-cache.cdnppb.net/feeds_images/Horses/SilkColours/',
  STR_SEARCH_LEN: 3,
  ODDS_API_LIMIT: 10,
  FUTURE_DATE_RANGE: 3, // Days
  STOP: { fancy_cron_status: '0' },
  START: { fancy_cron_status: '1', fancy_cron_time: 1 },
  ODDS_STOP: { odds_cron_status: '0' },
  ODDS_START: { odds_cron_status: '1', odds_cron_time: 1 },
  OAUTH_CLIENT_ID_1: 'client',
  OAUTH_CLIENT_SECRET_1: 'secret',
  OAUTH_CLIENT_ID_2: 'confidentialApplication',
  OAUTH_CLIENT_SECRET_2: 'topSecret',
  OAUTH_TOKEN_VAILIDITY: 1000 * 60 * 60 * 24,
  XCENTRAL_BASE_URL: 'https:///api/',
  API_ACCESS_PATH: '/api/v1-fe',
  agentcode: 'blackjack888',
  secretkey: 'cd12169e7898a03bdc4c3601a704ac7e8bc3578b061ef7c33ced532715bc335e',
}
