const fs = require('fs'),
  path = require('path')

const directory = 'logs'

/** remove log files */
fs.readdir(directory, (err, files) => {
  if (err) throw err

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err
    })
  }
})
