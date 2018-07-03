//
// routes.js
//
'use strict';

let routes = require('express').Router()
const StudentenhuisController = require('../controllers/studentenhuis.controller')
const MaaltijdController = require('../controllers/maaltijd.controller')
const DeelnemerController = require('../controllers/deelnemer.controller')


routes.get('/studentenhuis', StudentenhuisController.getAll)

routes.get('/studentenhuis/:huisId', StudentenhuisController.getById)

routes.get('/studentenhuis/:huisId/maaltijd', MaaltijdController.getAll)

routes.get('/studentenhuis/:huisId/maaltijd/:maaltijdId', MaaltijdController.getMaaltijdById)

routes.get('/studentenhuis/:huisId/maaltijd/:maaltijdId/deelnemers', DeelnemerController.getAll)

module.exports = routes