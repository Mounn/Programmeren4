//
// Authentication routes
//
'use strict';

const routes = require('express').Router();
const AuthController = require('../controllers/authentication.controller')
const UploadController = require('../controllers/upload.controller')

routes.post('/login', AuthController.login)

routes.post('/register', AuthController.register)

module.exports = routes