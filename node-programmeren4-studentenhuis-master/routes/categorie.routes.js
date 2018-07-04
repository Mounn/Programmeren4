//
// routes.js
//
'use strict';

let routes = require('express').Router()
const categorieController = require('../controllers/categorie.controller')
const SpullenController = require('../controllers/spullen.controller')
const DelersController = require('../controllers/delers.controller')

routes.post('/categorie', categorieController.create)
routes.put('/categorie/:huisId', categorieController.update)
routes.delete('/categorie/:huisId', categorieController.delete)

routes.post('/categorie/:huisId/spullen', SpullenController.create)
routes.put('/categorie/:huisId/spullen/:spullenId', SpullenController.update)
routes.delete('/categorie/:huisId/spullen/:spullenId', SpullenController.delete)

routes.post('/categorie/:huisId/spullen/:spullenId/delers', DelersController.create)
routes.delete('/categorie/:huisId/spullen/:spullenId/delers', DelersController.delete)

module.exports = routes