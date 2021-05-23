//@ts-check

// require bcyrpt 
const bcrypt = require('bcryptjs')

/**
 * 
 * @param {string} password 
 * @param {number} salt 
 * @returns {Promise}
 */
const hashPassword = async(password, salt = 10) => {
    try {

        // generate salt 
        const _salt = await bcrypt.genSalt(salt)

        // generate hash
        const hash = await bcrypt.hash(password, _salt)

        // check if no hash
        if (!hash) {
            return null
        }

        return hash

    } catch (error) {
        throw new Error(error)
    }
}

/**
 * 
 * @param {string} password 
 * @param {string} hash
 * @returns {Promise} 
 */
const comparePassword = async(password, hash) => {
    try {

        // compare password 
        const isValid = await bcrypt.compare(password, hash)

        return isValid

    } catch (error) {
        throw new Error(error)
    }
}



// export hashPassword
module.exports.hashPassword = hashPassword
module.exports.comparePassword = comparePassword