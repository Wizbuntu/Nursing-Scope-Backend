//@ts-check

// require express router
const router = require('express').Router()

// require verify
const verify = require('../middlewares/verify')


// require volume controller
const { createVolume, getAllVolumes, getAllArticlesByVolume, deleteSingleVolume } = require('../controllers/volumeController')


// init volume route endpoints
router.route('/volumes')
    .post(verify, createVolume)
    .get(getAllVolumes)



// init single Volume route
router.route('/volume/:id')
    .delete(verify, deleteSingleVolume)


// init find Articles by volume route
router.get('/articles/volume/:id', getAllArticlesByVolume)








// export router
module.exports = router