const express = require("express")
const router = express.Router()

const controller = require('../controller/DBController')

router.get("/", controller.index)
router.get('/answers', controller.answer)
router.post('/answers', controller.answer)

router.get("/gender-data", controller.gender)
router.get("/ages-data", controller.ages)
router.get("/civil-state-data", controller.civilState)
router.get("/nationality-data", controller.nationality)

module.exports = router
