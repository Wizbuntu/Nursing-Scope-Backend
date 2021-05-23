//@ts-check

// require Article Model
const Article = require('../models/Article')

// require uuid
const { validate: uuidValidate } = require('uuid')

// require limax
const slug = require('limax')

const { Op } = require("sequelize");

// require validation
const { createArticle: createArticleValidation } = require('../helpers/validations')



/**
 * 
 * @param {object} req 
 * @param {object} res 
 * @returns {Promise<any>}
 */
const articleFileUpload = async(req, res) => {
    try {

        // check if req.files is empty
        if (!req.files && Object.keys(req.files).length === 0) {
            return res.json({
                success: false,
                message: "Oops! Article upload failed"
            })
        }

        /**
         * articleFile accepts object from request files
         * @type {Object}
         */
        const articleFile = req.files.file

        // get articlePath
        const articlePath = `${process.cwd()}/public/articles/${Date.now()}.${articleFile.name.split('.').pop()}`

        // save articleFile to path
        articleFile.mv(articlePath, (error) => {
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
                message: "Article file uploaded successfully",
                data: {
                    fullFilePath: articlePath,
                    filePath: articlePath.split('/').splice(-2).join('/')
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
 * Create Article Controller
 * @param {Object} req 
 * @param {Object} res 
 * @returns {Promise<any>}
 */
const createArticle = async(req, res) => {
    try {

        // destructure article data from request body
        const { title, author, abstract, keywords, volume, article_file_url, article_image } = req.body

        /**
         * @type {{title:string, 
         * author:string, 
         * abstract:string, 
         * keywords:string, 
         * volume:string, 
         * article_file_url:string, 
         * article_image:string}}
         */
        const articleData = {
            title,
            author,
            abstract,
            keywords,
            volume,
            article_file_url,
            article_image,
        }

        // // validate articleData
        // const { error } = await createArticleValidation(articleData)

        // // check if errors
        // if (error && error.details[0].message) {
        //     return res.json({
        //         success: false,
        //         message: error.details[0].message
        //     })
        // }

        // generate slug 
        const url_slug = slug(articleData.title)

        // add slug to article dat object
        articleData['slug'] = url_slug

        // create new article
        await Article.create(articleData)


        // return response
        return res.json({
            success: true,
            message: "Article created successfully"

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
const getAllArticles = async(req, res) => {
    try {

        // get all Articles
        const articles = await Article.findAll({})

        // get pending articles
        const pendingArticles = await Article.findAll({ where: { status: "pending" } })

        // get published articles
        const publishedArticles = await Article.findAll({ where: { status: "published" } })


        // return json response
        return res.json({
            success: true,
            data: {
                articles,
                pendingArticles,
                publishedArticles,
            }
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
const getSingleArticle = async(req, res) => {
    try {

        // get article id
        const articleId = req.params.id

        // validate articleId
        if (!uuidValidate(articleId)) {
            return res.json({
                success: false,
                message: "Oops! article does not exist"
            })
        }


        // find article by id
        const article = await Article.findOne({ where: { id: articleId } })

        // check if no article 
        if (!article) {
            return res.json({
                success: false,
                message: "Oops! article does not exist"
            })
        }

        // return json response 
        return res.json({
            success: true,
            data: article
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
 * @param {object} res 
 * @returns {Promise<any>}
 */
const deleteSingleArticle = async(req, res) => {
    try {

        // get article id
        const articleId = req.params.id

        // validate articleId
        if (!uuidValidate(articleId)) {
            return res.json({
                success: false,
                message: "Oops! article does not exist"
            })
        }

        // find article by id
        const article = await Article.findOne({ where: { id: articleId } })

        // check if no article 
        if (!article) {
            return res.json({
                success: false,
                message: "Oops! article does not exist"
            })
        }

        // delete article
        await article.destroy()

        // return json response 
        return res.json({
            success: true,
            message: "article deleted successfully"
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
const updateSingleArticle = async(req, res) => {
    try {

        // get article id
        const articleId = req.params.id

        // get articleData 
        const articleData = req.body

        // validate articleId
        if (!uuidValidate(articleId)) {
            return res.json({
                success: false,
                message: "Oops! article does not exist"
            })
        }

        // find article by id
        const article = await Article.findOne({ where: { id: articleId } })

        // check if no article 
        if (!article) {
            return res.json({
                success: false,
                message: "Oops! article does not exist"
            })
        }

        // add slug to articleData object
        const url_slug = slug(articleData.title)
        articleData['slug'] = url_slug


        // update article 
        article['title'] = articleData.title
        article['author'] = articleData.author
        article['keywords'] = articleData.keywords
        article['volume'] = articleData.volume
        article['article_image'] = articleData.article_image
        article['article_file_url'] = articleData.article_file_url
        article['abstract'] = articleData.abstract
        article['status'] = articleData.status
        article['slug'] = articleData.slug

        await article.save()

        // return json response 
        return res.json({
            success: true,
            message: "Article updated successfully"
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
 * @returns 
 */
const searchFetchArticles = async(req, res) => {
    try {

        // get search query
        const { search } = req.query

        // get page query
        let _page = req.query.page ? parseInt(req.query.page) : 1

        // init options 
        const options = {
            page: _page,
            paginate: 1,
            order: [
                ['id']
            ],
            where: { status: "published" }
        }



        // check if search requery
        if (!search) {
            const { docs, pages, total } = await Article['paginate'](options)

            return res.json({
                success: true,
                articles: docs,
                pages: pages,
                total: total
            })
        } else {
            // get data
            const articles = await Article.findAll({ where: { status: "published", title: {
                        [Op.like]: `%${search.toUpperCase()}%` } } })

            return res.json({
                success: true,
                articles: articles,
            })
        }



    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            error: error
        })
    }
}


// init articleController
const articleController = {
    createArticle,
    articleFileUpload,
    getAllArticles,
    getSingleArticle,
    deleteSingleArticle,
    updateSingleArticle,
    searchFetchArticles
}


// export _Article 
module.exports = articleController