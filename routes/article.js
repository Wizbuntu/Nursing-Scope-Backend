//@ts-check

// require express router
const router = require('express').Router()

// require verify
const verify = require('../middlewares/verify')

// require article controllers
const { createArticle, articleFileUpload, getAllArticles, getSingleArticle, updateSingleArticle, deleteSingleArticle, searchFetchArticles } = require('../controllers/articleController')


// article file upload route
router.post('/article/file/upload', articleFileUpload)

// Get All Article & Create Article route
router.route('/article')
    .post(verify, createArticle)
    .get(getAllArticles)


// Single Article 
router.route('/article/:id')
    .get(getSingleArticle)
    .delete(verify, deleteSingleArticle)
    .put(verify, updateSingleArticle)


// Search Route
router.get('/search/articles', searchFetchArticles)










// export router
module.exports = router