const redis = require('redis'),
  { env } = require('../src/infrastructure/env'),
  { log } = require('../src/api/lib/logger');

/** REDIS config */
let config = {
  enable: env.REDIS_ENABLE,
  allow_local: env.REDIS_ALLOW_LOCAL,
  is_sadmin: env.REDIS_IS_ADMIN,
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  redisSSL_TLS: {
    auth_pass: env.REDIS_AUTH_PASSWORD,
    tls: {
      servername: env.REDIS_HOST,
    },
  },
}

/** REDIS default config */
function getDefaultConfig() {
  return {
    host: '127.0.0.1',
    port: 6379,
    redisSSL_TLS: {},
  }
}

if (!config.hasOwnProperty('enable')) config = getDefaultConfig()
if (config['enable'] == 'no') config = getDefaultConfig()

const client = redis.createClient({ url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}` });
client.on("error", function (error) {
  console.error(error);
});
module.exports = client
