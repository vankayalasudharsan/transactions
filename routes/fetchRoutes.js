const express = require('express')
const router = express.Router()
const controller = require('../controller/fetchApis')

router.get('/seed-data',controller.seedData)
router.get('/list',controller.list)
router.get('/statistics',controller.statistics)
router.get('/barchart',controller.barChart)
router.get('/piechart',controller.pieChart)
router.get('/commonapi',controller.combineData)

module.exports = router