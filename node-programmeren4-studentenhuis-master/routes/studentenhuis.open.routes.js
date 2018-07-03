//
// routes.js
//
'use strict';

let routes = require('express').Router()
const CategorieController = require('../controllers/categorie.controller')
const SpullenController = require('../controllers/spullen.controller')
const DelerController = require('../controllers/deler.controller')


routes.get('/categorie', CategorieController.getAll)

routes.get('/categorie/:categorienId', CategorieController.getById)

routes.get('/categorie/:categorienId/spullen', SpullenController.getAll)

routes.get('/categorie/:categorienId/spullen/:spullenId', SpullenController.getSpullenById)

routes.get('/categorie/:categorienId/spullen/:spullenId/delers', DelerController.getAll)

module.exports = routes