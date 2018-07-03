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
     * Aanmelden voor een maaltijd in een studentenhuis.
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
            const maaltijdId = req.params.maaltijdId
            const userId = req.user.id
            const query = 'INSERT INTO `deelnemers` (UserID, StudentenhuisID, MaaltijdID) VALUES (?, ?, ?)'
            const values = [userId, huisId, maaltijdId]
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
                            error = new ApiError('You have already been aangemeld as deelnemer.', 404)
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
            const maaltijdId = req.params.maaltijdId
            const query = 'SELECT Voornaam, Achternaam, Email FROM view_deelnemers WHERE StudentenhuisID = ? AND MaaltijdID = ?'
            const values = [huisId, maaltijdId]
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
                        const error = new ApiError('Non-exiting studentenhuis or maaltijd.', 404)
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
     * Afmelden voor een maaltijd in een studentenhuis.
     * Natuurlijk alleen als je aangemeld bent.
     */
    delete(req, res, next) {
        res.status(400).json({
            msg: 'Not implemented yet!'
        }).end()
    }

}