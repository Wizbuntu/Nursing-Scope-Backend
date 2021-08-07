//@ts-check

// require Volume Model
const Volume = require('../models/Volume')

// require Article Model
const Article = require('../models/Article')

// require validations 
const validations = require('../helpers/validations')

// require uuid
const { validate: uuidValidate } = require('uuid')


/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const createVolume = async(req, res) => {
    try {

        // destructure request body
        const { volume, issue, date } = req.body

        /**
         * @type {{volume:String, issue:String, date:String}}
         */
        const volumeData = {
            volume: volume,
            issue: issue,
            date: date
        }

        // validate volumeData 
        const { error } = await validations.createVolume(volumeData)

        // check if errors
        if (error && error.details[0].message) {
            return res.json({
                success: false,
                message: error.details[0].message
            })
        }

        // create new volume
        await Volume.create(volumeData)

        // return json response 
        return res.json({
            success: true,
            message: "Volume/Issues Created Successfully"
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
const getAllVolumes = async(req, res) => {
    try {

        // fetch all volumes
        const volumes = await Volume.findAll({})

        //return response 
        return res.json({
            success: true,
            data: volumes
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
const deleteSingleVolume = async(req, res) => {
    try {

        // get volumeId 
        const volumeId = req.params.id

        // validate volumeId
        if (!uuidValidate(volumeId)) {
            return res.json({
                success: false,
                message: "Oops! Volume/Issue does not exist"
            })
        }

        // find Volume by id
        const volume = await Volume.findOne({ where: { id: volumeId } })

        // check if not volume
        if (!volume) {
            return res.json({
                success: false,
                message: "Oops! Volume/Issue does not exist"
            })
        }

        // delete volume 
        await volume.destroy()

        return res.json({
            success: true,
            message: "Volume/Issue deleted successfully"
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
const getAllArticlesByVolume = async(req, res) => {
    try {

        // get volumeId 
        const volumeId = req.params.id

        // validate volumeId
        if (!uuidValidate(volumeId)) {
            return res.json({
                success: false,
                message: "Oops! Volume/Issue does not exist"
            })
        }

        // find articles by volume Id
        const articles = await Article.findAll({ where: { status: "published", volume: volumeId } })


        return res.json({
            success: true,
            data: articles
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}



// init volumeController
const volumeController = {
    createVolume,
    getAllVolumes,
    deleteSingleVolume,
    getAllArticlesByVolume
}


// export volumeConroller
module.exports = volumeController