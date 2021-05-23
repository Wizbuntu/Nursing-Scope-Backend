//@ts-check

// require Joi
const Joi = require('joi')



/**
 * 
 * @param {Object} registerData 
 * @returns {Promise<Object>} 
 */
const createAccount = async(registerData) => {
    try {

        // init schema 
        const schema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        })

        return schema.validate(registerData)

    } catch (error) {
        throw new Error(error)
    }
}

/**
 * 
 * @param {object} loginData 
 * @returns {Promise}
 */
const Login = async(loginData) => {
    try {

        // init schema 
        const schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })

        return schema.validate(loginData)

    } catch (error) {
        throw new Error(error)
    }
}



const createArticle = async(articleData) => {
    try {

        // init schema 
        const schema = Joi.object({
            title: Joi.string().required(),
            author: Joi.string().required(),
            abstract: Joi.string().required(),
            keywords: Joi.string().optional(),
            volume: Joi.string().optional(),
            article_file_url: Joi.string().required(),
            article_image: Joi.string().optional()
        })


        // return schema validation
        return schema.validate(articleData)

    } catch (error) {
        throw new Error(error)
    }
}



// init validations
const validations = {
    createAccount,
    Login,
    createArticle
}

//export validations 
module.exports = validations