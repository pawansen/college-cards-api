const db = require('../../../../config/db')

/** DDL database all tables */
db.sequelize.sync({ force: true })
