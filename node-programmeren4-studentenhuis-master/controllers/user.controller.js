//
// CRUD operations on person
//
'use strict';

const User = require('../model/User')
const ApiError = require('../model/ApiError')
const auth = require('../util/auth/authentication')
const pool = require('../config/db')
const assert = require('assert')
const logger = require('../config/config').logger

module.exports = {

    /**
     * Create a new person and add it to the list.
     * 
     * @param {*} req The incoming request.
     * @param {*} res The newly created person.
     * @param {*} next ApiError when id is invalid.
     */
    createUser(req, res, next) {

        try {
            assert(typeof (req.body) === 'object', 'request body must have an object containing firstname and lastname.')
            assert(typeof (req.body.firstname) === 'string', 'firstname must be a string.')
            assert(typeof (req.body.lastname) === 'string', 'lastname must be a string.')
            assert(typeof (req.body.email) === 'string', 'email must be a string.')
            assert(typeof (req.body.password) === 'string', 'password must be a string.')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 422)
            next(error)
            return
        }

        let user = new User(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password
        )
        personlist.push(user)

        res.status(200).json(user.toString()).end();
    },

    /**
     * Get the current list of persons.
     * 
     * @param {*} req The incoming request. No properties required. 
     * @param {*} res Respond contains the list as an array.
     * @param {*} next Unused here (no errors expected.)
     */
    getAllUsers(req, res, next) {
        // When authenticated (which we are at this point), we have the user info in the request.
        // We can use that for example for logging or monitoring.
        logger.info('User info in getAllPersons: ' + req.user)
        res.status(200).json({
            message: "todo!"
        }).end();
    },

    /**
     * Get a person by given id. The id is the index in the personlist.
     * 
     * @param {*} req req.params.id is the person's id in the personlist.
     * @param {*} res The requested person object.
     * @param {*} next ApiError when id is invalid.
     */
    getUserById(req, res, next) {
        const id = req.params.id
        try {
            assert(!isNaN(id) && id >= 0 && id < personlist.length, 'parameter id is invalid: ' + id)
        } catch (ex) {
            const error = new ApiError(ex.toString(), 404)
            next(error)
            return
        }
        res.status(200).json({
            message: 'todo!'
        }).end();
    },

    //
    //

    /**
     * Replace an existing person in the list. We need an id and a new person 
     * object. The new person will be stored at index id.
     * 
     * @param {*} req req.params.id is the person's id in the personlist. req.body contains the new person object.
     * @param {*} res The updated person object.
     * @param {*} next ApiError when id and/or person object are invalid.
     */
    updateUserById(req, res, next) {
        const id = req.params.id
        const person = req.body
        try {
            // We need a valid id 
            assert(!isNaN(id) && id >= 0 && id < personlist.length, 'parameter id is invalid: ' + id)
            // And we need a valid person
            assert(typeof (person) === 'object', 'name must be a valid object')
            assert(typeof (person.firstname) === 'string', 'firstname must be a string')
            assert(typeof (person.lastname) === 'string', 'lastname must be a string')
            assert(typeof (req.body.email) === 'string', 'email must be a string.')
            assert(typeof (req.body.password) === 'string', 'password must be a string.')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 404)
            next(error)
            return
        }

        let user = new User(
            req.body.firstname,
            req.body.lastname,
            req.body.email,
            req.body.password
        )
        personlist[id] = user
        res.status(200).json(user.toString()).end();
    },

    deleteUserById(req, res, next) {
        const id = req.params.id
        try {
            // We need a valid id 
            assert(!isNaN(id) && id >= 0 && id < personlist.length, 'parameter id is invalid: ' + id)
        } catch (ex) {
            const error = new ApiError(ex.toString(), 404)
            next(error)
            return
        }
    },

    /**
     * Return the token, username, user email and user profile picture url. 
     * 
     * @param {object} req 
     * @param {object} res 
     * @param {function} next 
     */
    getUserProfile(req, res, next) {

        logger.trace("getUserProfile")
        const ID = req.user.id
        logger.trace("req.user.id = ", ID)

        try {
            const sqlQuery = 'SELECT CONCAT(`user`.`Voornaam`, \' \', `user`.`Achternaam`) AS `Fullname`,' + 
                '`user`.`Email` ' +
                'FROM `user` WHERE `ID` = ?'
            pool.getConnection((err, connection) => {
                if (err) {
                    logger.error('Error getting connection from pool: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query(sqlQuery, [ID], (err, rows, fields) => {
                    connection.release()
                    if (err) {
                        const error = new ApiError(err, 500)
                        next(error);
                    } else {
                        if(rows.length !== 1) {
                            const error = new ApiError(err, 400)
                            next(error);
                        } else {
                            // Create an object containing the data we want in the payload.
                            const payload = {
                                user: rows[0].Email,
                                id: ID
                            }
                            // Userinfo returned to the caller.
                            const userinfo = {
                                token: auth.encodeToken(payload),
                                username: rows[0].Fullname,
                                email: rows[0].Email,
                            }
                            res.status(200).json(userinfo).end()
                        }
                    }
                })
            })
        } catch (ex) {
            logger.error(ex)
            const error = new ApiError(ex, 412)
            next(error);
        }
    }

}