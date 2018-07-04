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
        // req moet de juiste attributen hebben - de nieuwe categorie
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }
        // Hier hebben we de juiste body als input.

        // 1. Zoek in pool of categorie met huisId bestaat
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM delers WHERE ID = ?', [ req.params.huisId ],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            // rows MOET hier 1 waarde bevatten - nl. het gevonden categorie.
                            if(rows.length !== 1) {
                                // zo nee, dan error
                                const error = new ApiError("Niet gevonden (categorieId bestaat niet)", 404)
                                next(error);
                            } else {
                                // zo ja, dan
                                // - check eerst of de huidige user de 'eigenaar' van het categorie is
                                if(rows[0].UserID !== req.user.id) {
                                    //  - zo nee, error
                                    const error = new ApiError("Je mag alleen je eigen categorien verwijderen, dit is iemands anders categorie id= " + rows[0].UserID, 412)
                                    next(error);
                                } else {
                                    //  - zo ja, dan SQL query DELETE
                                    pool.query(
                                        'DELETE FROM delers WHERE ID = ?',
                                        [ req.params.huisId ],
                                        (err, rows, fields) => {
                                            if(err) {
                                                // handle error
                                                const error = new ApiError(err, 412)
                                                next(error);
                                            } else {
                                                // handle success
                                                res.status(200).json({ result: "je hebt succesvol je delers verwijdert!"}).end()
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
    }

}