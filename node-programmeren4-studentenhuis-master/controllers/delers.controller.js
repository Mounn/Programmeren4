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
            // hier moet nog require naam,achternaam,email komen dan select en ophalen in 200 succes code
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
                            error = new ApiError('You have already been aangemeld as deler.', 404)
                        } else {
                            error = new ApiError(err, 412)
                        }
                        next(error);
                    } else {
                        res.status(200).json({status: rows}).end()
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
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            // More validations here.
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        const huisId = req.params.huisId
        const spullenId = req.params.spullenId

        // 1. Zoek in pool of categorie met categorieId bestaat + spullenId correct is
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM delers WHERE spullenID = ? AND categorieID = ? AND UserID = ?', [ spullenId, huisId, req.user.id],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            // rows MOET hier 1 waarde bevatten - nl. het gevonden categorie.
                            if(rows[0].UserID !== req.user.id) {
                                // zo nee, dan error
                                const error = new ApiError("deler and user do not match", 404)
                                next(error);
                            } else {
                                //  - zo ja, dan SQL query UPDATE
                                pool.query(
                                    'DELETE FROM delers WHERE UserID = ? AND spullenID =? AND categorieID = ?',
                                    [req.user.id, spullenId, huisId],
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
                    })
            })
        } catch (ex) {
            logger.error(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    }

}