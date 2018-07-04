//
// routes.js
//
'use strict';

let routes = require('express').Router()
const categorieController = require('../controllers/categorie.controller')
const MaaltijdController = require('../controllers/maaltijd.controller')
const DeelnemerController = require('../controllers/delers.controller')


routes.get('/categorie', categorieController.getAll)

routes.get('/categorie/:huisId', categorieController.getById)

routes.get('/categorie/:huisId/maaltijd', MaaltijdController.getAll)

routes.get('/categorie/:huisId/maaltijd/:maaltijdId', MaaltijdController.getMaaltijdById)

routes.get('/categorie/:huisId/maaltijd/:maaltijdId/delers', DeelnemerController.getAll)

module.exports = routes