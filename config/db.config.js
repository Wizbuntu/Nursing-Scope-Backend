// require sequelize 
const { Sequelize } = require('sequelize')

// require dotenv
const dotenv = require('dotenv')


// init dotenv 
dotenv.config({})


// init instance of sequelize  
const sequelize = new Sequelize(`postgres://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@localhost:5432/${process.env.DATABASE}`, {
    logging: false,
    dialect: 'postgres'
})


// connect
sequelize.authenticate()
    .then(() => {
        console.log("Database connection successful")
    })
    .catch((error) => {
        console.log("Database connection failed")
    })




// export sequelize 
module.exports = { sequelize }