// require dotenv 
const dotenv = require('dotenv')

// require sequelize 
const { sequelize } = require('./config/db.config')


// require app 
const app = require('./app')


// sync database
sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database tables created or updated")
    })
    .catch((error) => {
        console.log(error)
    })



// init PORT & listen to server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`)
})