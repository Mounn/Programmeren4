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

        logger.debug('req.user = ', req.user)
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and beschrijving.')
            assert(typeof (req.body.naam) === 'string', 'naam must be a string.')
            assert(typeof (req.body.beschrijving) === 'string', 'beschrijving must be a string.')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('INSERT INTO `categorie` (`Naam`, `Beschrijving`, `UserID`) VALUES (?,?,?)',
                    [req.body.naam, req.body.beschrijving, req.user.id],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err.toString(), 412)
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
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM view_categorie',
                (err, rows, fields) => {
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
    getById(req, res, next) {
        try {
            assert(req.params.huisId, 'ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM view_categorie WHERE ID = ?', [req.params.huisId],
                (err, rows, fields) => {
                    connection.release()
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else {
                        res.status(200).json({ result: rows[0] }).end()
                    }
                })
            })
        } catch (ex) {
            logger.error(ex)
            const error = new ApiError(ex, 412)
            next(error);
        }
    },

    /**
     * Replace an existing object in the database.
     */
    update(req, res, next) {

        // req moet de juiste attributen hebben - het nieuwe categorie
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and beschrijving.')
            assert(typeof (req.body.naam) === 'string', 'naam must be a string.')
            assert(typeof (req.body.beschrijving) === 'string', 'beschrijving must be a string.')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }
        // Hier hebben we de juiste body als input.

        const ID = req.params.huisId
        // 1. Zoek in db of categorie met huisId bestaat
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM view_categorie WHERE ID = ?', [ ID ],
                (err, rows, fields) => {
                    connection.release()
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else {
                        // rows MOET hier 1 waarde bevatten - nl. het gevonden categorie.
                        if(rows.length !== 1) {
                            // zo nee, dan error 
                            const error = new ApiError(err, 404)
                            next(error);
                        } else {
                            // zo ja, dan

                            if(rows[0].UserID != req.user.id) {
                                console.log("Request mislukt.")
                                const error = new ApiError('Gebruiker mag deze data niet wijzigen. Alleen de maker mag dat.', 412)
                                next(error);
                            } else {
                                //  - zo ja, dan SQL query UPDATE
                                db.query(
                                    'UPDATE categorie SET `Naam` = \'' + name + '\', `Beschrijving` = \'' + beschrijving + '\' WHERE `UserID`= ' + id + ' AND `ID` = ' + houseId + '',
                                    [ req.body.naam, req.params.huisId], 
                                    (err, rows, fields) => {
                                        if(err) {
                                            // handle error
                                            const error = new ApiError(err, 412)
                                            next(error);
                                        } else {
                                            // handle success
                                            res.status(200).json({ result: rows }).end()
                                        }
                                })
                            }
                        }
                    }
                })
            })
        } catch (ex) {
            logger.error(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    delete(req, res, next) {
        res.status(400).json({
            msg: 'Not implemented yet!'
        }).end()
    }

}