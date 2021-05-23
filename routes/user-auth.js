// require express router
const router = require('express').Router()

// require verify
const verify = require('../middlewares/verify')

// require authController 
const { createAccount, profileImageUpload, deleteUser, fetchAllUsers, Login, verifyUser } = require('../controllers/authController')


// verify user route
router.get('/verify/user', verify, verifyUser)

// profileImageUpload route
router.post('/profile/image/upload', profileImageUpload)

// create account route
router.post('/create/account', verify, createAccount)

// fetch all users route
router.get('/fetch/all/users', verify, fetchAllUsers)

// delete single user
router.delete('/user/delete/:id', verify, deleteUser)

// login route
router.post('/login', Login)



// export router
module.exports = router