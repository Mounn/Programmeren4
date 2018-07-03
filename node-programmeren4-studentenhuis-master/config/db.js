//
// ./config/pool.js
//
// Configuratiebestand voor MySql database.
//
'use strict';

const mysql = require('mysql')
const config = require('../config/config')
const logger = config.logger
const reconnectTimeout = 2000 // ms.

const connectionSettings = {
    connectionLimit: 20,
    host: process.env.DB_HOST || config.dbHost,
    user: process.env.DB_USER || config.dbUser,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || config.dbDatabase,
    port: 3306,
    debug: false
}

var pool

// http://sudoall.com/node-js-handling-mysql-disconnects/
// function handleDisconnect() {
pool = mysql.createPool(connectionSettings)

pool.on('acquire', (connection) => {
    logger.trace('Connection %d acquired', connection.threadId)
})

pool.on('connection', (connection) => {
    logger.trace('Connection to database was made')
})

pool.on('enqueue', () => {
    logger.trace('Waiting for available connection slot')
})

pool.on('release', (connection) => {
    logger.trace('Connection %d released', connection.threadId)
})

module.exports = pool