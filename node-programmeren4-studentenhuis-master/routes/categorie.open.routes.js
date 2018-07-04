//
// routes.js
//
'use strict';

let routes = require('express').Router()
const categorieController = require('../controllers/categorie.controller')
const SpullenController = require('../controllers/spullen.controller')
const DelersController = require('../controllers/delers.controller')


routes.get('/categorie', categorieController.getAll)
routes.get('/categorie/:huisId', categorieController.getById)
routes.get('/categorie/:huisId/spullen', SpullenController.getAll)
routes.get('/categorie/:huisId/spullen/:spullenId', SpullenController.getSpullenById)
routes.get('/categorie/:huisId/spullen/:spullenId/delers', DelersController.getAll)

module.exports = routes