const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABSE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  //port: ,
    dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false // important
      }
  }
})
module.exports = {
  sequelize: sequelize
}

