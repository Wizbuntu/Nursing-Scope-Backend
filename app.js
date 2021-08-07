// require express
const express = require('express')

//require morgan 
const morgan = require('morgan')

// require cors
const cors = require('cors')

// require path
const path = require('path')

// require express file upload 
const expressFileUpload = require('express-fileupload')

// require user-auth router
const userAuth = require('./routes/user-auth')

// require Article route
const articleRoute = require('./routes/article')

// require Volume Route
const volumeRoute = require('./routes/volume')


// init app 
const app = express()


// ========================== MIDDLEWARE ===========================
// morgan
app.use(morgan('dev'))

// cors
app.use(cors({ origin: "http://localhost:3000" }))

// express urlencoded
app.use(express.urlencoded({ extended: true }))

// express json
app.use(express.json())

// express file upload 
app.use(expressFileUpload())

// use public folder
app.use(express.static('public'))


// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('*', function(req, res) {
//     res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
// });


// ==================
app.use('/v1/api', userAuth)
app.use('/v1/api', articleRoute)
app.use('/v1/api', volumeRoute)



// export app 
module.exports = app