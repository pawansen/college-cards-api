const fs = require('fs'),
  { log } = require('./logger')

module.exports = {
  createLog: async function (filename, message) {
    try {
      const filenames = './logs/' + filename + '.log'
      fs.open(filenames, 'r', function (err) {
        if (err) {
          fs.writeFile(filenames, '', function (err) {
            if (err) logger.error(err)
            writeLog(filenames, message)
          })
        } else writeLog(filenames, message)
      })
    } catch (error) {
      log.error(error)
    }
  },
}

function writeLog(filename, message) {
  try {
    const data = fs.readFileSync(filename).toString().split('\n')
    data.splice(0, 0, message)
    const text = data.join('\n')
    fs.writeFile(filename, text, function (error) {
      if (error) return error
    })
  } catch (error) {
    log.error('Error : 79NHI8', error)
  }
}
