//@ts-check

// require jwt 
const jwt = require('jsonwebtoken')

// require dotenv 
require('dotenv').config()

// require User
const User = require('../models/User')

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next
 * @returns {Promise<any>}
 */
const verify = async(req, res, next) => {
    try {

        /**
         * @type {string}
         */
        const token = req.headers.authorization

        console.log(token)

        // check if no token
        if (!token) {
            return res.json({
                success: false,
                message: "access denied"
            })
        }

        // verify token
        const decoded = await jwt.verify(token, process.env.LOGIN_SECRET)

        // find user with email and id
        const user = await User.findOne({ where: { id: decoded['id'], email: decoded['email'] } })

        // check if no user
        if (!user) {
            return res.json({
                success: false,
                message: "access denied"
            })
        }

        /**
         * @type {{id:string, firstName:string, lastName:string, email:string, profilePic:string}}
         */
        const userData = {
            id: user.getDataValue('id'),
            firstName: user.getDataValue('firstName'),
            lastName: user.getDataValue('lastName'),
            email: user.getDataValue('email'),
            profilePic: user.getDataValue('profilePic')
        }


        // assign userData to request object 
        req.user = userData


        // invoke next function 
        next()

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}


// export verify
module.exports = verify