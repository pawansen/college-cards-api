const fs = require('fs'),
  path = require('path')

const directory = 'uploads/users'

/** remove upload files */
fs.readdir(directory, (err, files) => {
  if (err) throw err

  for (const file of files) {
    fs.unlink(path.join(directory, file), (err) => {
      if (err) throw err
    })
  }
})
