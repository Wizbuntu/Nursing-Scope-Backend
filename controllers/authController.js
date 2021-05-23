// @ts-check

// require User model 
const User = require('../models/User')

// require validations 
const validations = require('../helpers/validations')

// require hashPassword 
const { hashPassword, comparePassword } = require('../helpers/hashPassword')

// require jwt
const jwt = require('jsonwebtoken')

// require dotenv
require('dotenv').config()





/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const verifyUser = async(req, res) => {
    try {

        return res.json({
            success: true,
            data: req.user,
            message: "authentication successful"
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}


/**
 * user profile image upload function
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const profileImageUpload = async(req, res) => {
    try {

        // check if req.files is empty
        if (!req.files && Object.keys(req.files).length === 0) {
            return res.json({
                success: false,
                message: "Oops! image upload failed"
            })
        }

        /**
         * imageFile accepts object
         * @type {Object}
         */
        const imageFile = req.files.image

        // get imagePath
        const imagePath = `${process.cwd()}/public/profile_pic/${Date.now()}.${imageFile.name.split('.').pop()}`

        // save imageFile to path
        imageFile.mv(imagePath, (error) => {
            if (error) {
                console.log(error)
                return res.status(400).json({
                    success: false,
                    error: error
                })
            }

            // return success
            return res.json({
                success: true,
                message: "Image file uploaded successfully",
                data: {
                    fullImagePath: imagePath,
                    imagePath: imagePath.split('/').splice(-2).join('/')
                }
            })
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}





/**
 * createAccount function
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const createAccount = async(req, res) => {
    try {

        // destructure request body
        const { firstName, lastName, email, password } = req.body

        /**
         * registerData 
         * @type {{firstName:string, lastName: string, email: string, password: string}}
         */
        const registerData = {
            firstName,
            lastName,
            email,
            password,
        }

        // validate registerData
        const { error } = await validations.createAccount(registerData)

        // check if error
        if (error && error.details[0].message) {
            return res.json({
                success: false,
                message: error.details[0].message
            })
        }

        /**
         * find user with email
         * @type {Object}
         */
        const user = await User.findOne({ where: { email: registerData.email } })

        // check if user exist
        if (user) {
            return res.json({
                success: false,
                message: "Oops! user already exist"
            })
        }

        // hash password
        const passwordHash = await hashPassword(registerData.password, 10)

        // check if no hash
        if (!passwordHash) {
            throw new Error("Oops! an error has occurred")
        }

        // copy registerData 
        const registerDTO = registerData

        // update password property to hash value 
        registerDTO['password'] = passwordHash


        // create User 
        await User.create(registerDTO)


        // return success
        return res.json({
            success: true,
            message: "Account created successfully"
        })


        // validate 
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}




/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const Login = async(req, res) => {
    try {

        // destructure request body
        const { email, password } = req.body

        /**
         * init loginData 
         * @type {{email:string, password:string}}
         * 
         */
        const loginData = {
            email,
            password
        }


        // validate loginData 
        const { error } = await validations.Login(loginData)

        // check if error
        if (error && error.details[0].message) {
            return res.json({
                success: false,
                message: error.details[0].message
            })
        }

        // find user
        const user = await User.findOne({ where: { email: loginData.email } })

        // check if user does not exist 
        if (!user) {
            return res.json({
                success: false,
                message: "Oops! invalid email or password"
            })
        }


        // compare password
        const isValid = await comparePassword(loginData.password, user.getDataValue('password'))

        // check is not valid
        if (!isValid) {
            return res.json({
                success: false,
                message: "Oops! invalid email or password"
            })
        }

        // generate token
        const token = await jwt.sign({ id: user.getDataValue('id'), email: user.getDataValue('email') }, process.env.LOGIN_SECRET)


        // return response 
        return res.json({
            success: true,
            token: token
        })



    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const fetchAllUsers = async(req, res) => {
    try {

        const users = await User.findAll({})

        return res.json({
            success: true,
            data: users
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })

    }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const deleteUser = async(req, res) => {
    try {

        // get userId
        const userId = req.params.id

        // find user with id 
        const user = await User.findOne({ where: { id: userId } })

        // check if no user
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            })
        }

        // delete user from db
        await user.destroy()

        // return response 
        return res.json({
            success: true,
            message: "User deleted successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}




// init authController
const authController = {
    createAccount,
    profileImageUpload,
    Login,
    verifyUser,
    fetchAllUsers,
    deleteUser
}


// export 
module.exports = authController