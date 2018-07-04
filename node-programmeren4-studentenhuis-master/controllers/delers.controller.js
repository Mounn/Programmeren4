//
// CRUD operations
//
'use strict';

const ApiError = require('../model/ApiError')
const assert = require('assert')
const pool = require('../config/db')
const logger = require('../config/config').logger

module.exports = {

    /**
     * Aanmelden voor een spullen in een categorie.
     */
    create(req, res, next) {

        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            // Hier moeten meer validaties komen.
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        try {
            const huisId = req.params.huisId
            const spullenId = req.params.spullenId
            const userId = req.user.id
            const query = 'INSERT INTO `delers` (UserID, categorieID, spullenID) VALUES (?, ?, ?)'
            const values = [userId, huisId, spullenId]
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query(query, values, (err, rows, fields) => {
                    connection.release()
                    if (err) {
                        let error;
                        if (err.code && err.code === 'ER_DUP_ENTRY') {
                            error = new ApiError('You have already been logged in as deler.', 404)
                        } else {
                            error = new ApiError(err, 412)
                        }
                        next(error);
                    } else {
                        res.status(200).json({
                            status: rows
                        }).end()
                    }
                })
            })
        } catch (ex) {
            logger.error(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    /**
     * Haal alle items op. 
     */
    getAll(req, res, next) {

        try {
            const huisId = req.params.huisId
            const spullenId = req.params.spullenId
            const query = 'SELECT Voornaam, Achternaam, Email FROM view_delers WHERE categorieID = ? AND spullenID = ?'
            const values = [huisId, spullenId]
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query(query, values, (err, rows, fields) => {
                    connection.release()
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    }
                    if (rows.length === 0) {
                        const error = new ApiError('Non-exiting categorie or spullen.', 404)
                        next(error);
                    } else {
                        res.status(200).json({result: rows}).end()
                    }
                })
            })
        } catch (ex) {
            logger.error(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    /**
     * Afmelden voor een spullen in een categorie.
     * Natuurlijk alleen als je aangemeld bent.
     */
    delete(req, res, next) {
        res.status(400).json({
            msg: 'Not implemented yet!'
        }).end()
    }

}