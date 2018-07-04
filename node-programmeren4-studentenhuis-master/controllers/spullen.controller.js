//
// CRUD operations
//
'use strict';

const ApiError = require('../model/ApiError')
const assert = require('assert')
const pool = require('../config/db')
const logger = require('../config/config').logger

module.exports = {

    create(req, res, next) {

        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and beschrijving.')
            assert(typeof (req.body.naam) === 'string', 'naam must be a string.')
            // More validations here.
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        try {
            const huisId = req.params.huisId
            const userId = req.user.id
            const query = 'INSERT INTO `spullen` (Naam, Beschrijving, Merk, Soort, Bouwjaar, UserID, categorieID) VALUES (?, ?, ?, ?, ?, ?, ?)'
            const values = [req.body.naam, req.body.beschrijving, req.body.merk, req.body.soort, req.body.bouwjaar, userId, huisId]
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query(query, values,
                (err, rows, fields) => {
                    connection.release()
                    if (err) {
                        const error = new ApiError(err, 412)
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
     * Haal alle items op voor de user met gegeven id.
     * De user ID zit in het request na validatie!
     */
    getAll(req, res, next) {
        try {
            const huisId = req.params.huisId
            const query = 'SELECT ID, Naam, Beschrijving, Merk, Soort, Bouwjaar FROM spullen WHERE categorieID = ?'
            const values = [huisId]
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query(query, (err, rows, fields) => {
                    connection.release()
                    if (err) {
                        const error = new ApiError(err, 412)
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
     * Haal alle items op voor de user met gegeven id.
     * De user ID zit in het request na validatie!
     */
    getSpullenById(req, res, next) {

        try {
            const huisId = req.params.huisId
            const spullenId = req.params.spullenId
            const query = 'SELECT ID, Naam, Beschrijving, Merk, Soort, Bouwjaar FROM spullen WHERE categorieID = ? AND ID = ?'
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
                        const error = new ApiError('Non-exiting spullen or not allowed to access it.', 404)
                        next(error);
                    } else {
                        res.status(200).json({result: rows[0]}).end()
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
     * Replace an existing object in the database.
     */
    update(req, res, next) {
        res.status(200).json({
            msg: 'Not implemented yet!'
        }).end()
    },

    /**
     * Delete an item.
     *
     * @param {object} req
     * @param {object} res
     * @param {function} next
     */
    delete(req, res, next) {
        res.status(400).json({
            msg: 'Not implemented yet!'
        }).end()
    }

}