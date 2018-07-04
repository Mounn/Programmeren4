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
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and adres.')
            assert(typeof (req.body.naam) === 'string', 'naam must be a string.')
            assert(typeof (req.body.beschrijving) === 'string', 'beschrijving must be a string.')
            assert(typeof (req.body.merk) === 'string', 'merk must be a string.')
            assert(typeof (req.body.soort) === 'string', 'soort must be a string.')
            assert(typeof (req.body.bouwjaar) === 'number', 'bouwjaar must be a number.')

        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        try {
            const userId = req.user.id
            const huisId = req.params.huisId
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
                            const error = new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412)
                            next(error);
                        } else {
                            pool.query(
                                'SELECT * FROM spullen WHERE ID = ?',
                                [ rows.insertId ],

                                (err, rows, fields) => {
                                    if(err) {
                                        // handle error
                                        const error = new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412)
                                        next(error);
                                        // get the Row information
                                    } else {
                                        res.status(200).json({ result: rows }).end()
                                    }
                                })
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
                connection.query('SELECT * FROM spullen WHERE CategorieID = ?', [req.params.huisId],
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
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and adres.')
            assert(typeof (req.body.naam) === 'string', 'naam must be a string.')
            assert(typeof (req.body.beschrijving) === 'string', 'beschrijving must be a string.')
            assert(typeof (req.body.merk) === 'string', 'merk must be a string.')
            assert(typeof (req.body.soort) === 'string', 'soort must be a string.')
            assert(typeof (req.body.bouwjaar) === 'number', 'bouwjaar must be a number.')
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
                connection.query('SELECT * FROM spullen WHERE ID = ? AND categorieID = ?', [ spullenId, huisId ],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            // rows MOET hier 1 waarde bevatten - nl. het gevonden categorie.
                            if(rows.length !== 1) {
                                // zo nee, dan error
                                const error = new ApiError("Not existing row/spullen", 404)
                                next(error);
                            } else {
                                // zo ja, dan
                                // - check eerst of de huidige user de 'eigenaar' van het categorie is
                                if(rows[0].UserID !== req.user.id) {
                                    //  - zo nee, error
                                    const error = new ApiError(err, 412)
                                    next(error);
                                } else {
                                    //  - zo ja, dan SQL query UPDATE
                                    pool.query(
                                        'UPDATE spullen SET Naam = ?, Beschrijving = ?, Merk = ?, Soort = ?, Bouwjaar = ? WHERE ID = ?',
                                        [ req.body.naam, req.body.beschrijving, req.body.merk, req.body.soort, req.body.bouwjaar, spullenId],
                                        (err, rows, fields) => {
                                            if(err) {
                                                // handle error
                                                const error = new ApiError(err, 412)
                                                next(error);
                                            } else {
                                                // handle success
                                                pool.query(
                                                    'SELECT * FROM spullen WHERE ID = ?',
                                                    [ spullenId ],
                                                    (err, rows, fields) => {
                                                        if(err) {
                                                            // handle error
                                                            const error = new ApiError(err, 412)
                                                            next(error);
                                                        } else {
                                                            res.status(200).json({ result: rows }).end()
                                                        }
                                                    })
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

    /**
     * Delete an item.
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

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM spullen WHERE ID = ? AND categorieID = ?', [ spullenId, huisId ],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            // rows MOET hier 1 waarde bevatten - nl. het gevonden categorie.
                            if(rows.length !== 1) {
                                // zo nee, dan error
                                const error = new ApiError("Niet gevonden Hij bestaat niet)", 404)
                                next(error);
                            } else {
                                // zo ja, dan
                                // - check eerst of de huidige user de 'eigenaar' van het categorie is
                                if(rows[0].UserID !== req.user.id) {
                                    //  - zo nee, error
                                    const error = new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412)
                                    next(error);
                                } else {
                                    //  - zo ja, dan SQL query DELETE
                                    pool.query(
                                        'DELETE FROM spullen WHERE ID = ?',
                                        [spullenId],
                                        (err, rows, fields) => {
                                            if(err) {
                                                // handle error
                                                const error = new ApiError("Een of meer properties in de request body ontbreken of zijn foutief", 412)
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
    }

}