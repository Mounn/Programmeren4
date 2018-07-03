//
// User class
//
'use strict';

const assert = require('assert')
const ApiError = require('./ApiError')
const bcrypt = require('bcryptjs');
const validateEmail = require('../util/emailvalidator')
const logger = require('../config/config').logger

class User {

    constructor(firstname, lastname, email, password) {
        logger.info('User constructor')
        // Verify that we only create valid Users
        try {
            assert(typeof (firstname) === 'string', 'firstname must be a string')
            assert(typeof (lastname) === 'string', 'lastname must be a string')
            assert(typeof (email) === 'string', 'email must be a string')
            assert(typeof (password) === 'string', 'password must be a string')
            assert(firstname.trim().length > 2, 'firstname must be at least 3 characters')
            assert(lastname.trim().length > 2, 'lastname must be at least 3 characters')
            assert(validateEmail(email.trim()), 'email must be a valid emailaddress')
            assert(password.trim().length > 2, 'password must be at least 3 characters')
        } catch (ex) {
            logger.error(ex.toString())
            /**
             * We cannot handle the error by Express next(), so we throw it here.
             * The calling function must surround this constructor with try/catch
             * and forward the ApiError exeption to next() for us.
             */
            throw (new ApiError(ex.toString(), 412))
        }

        this.name = {
            firstname: firstname.trim(), // trim removes whitespace in front and at end
            lastname: lastname.trim()
        }
        this.email = email.trim()
        // Encrypt the password - never store a password as plain text!
        this.password = bcrypt.hashSync(password.trim(), 8); // Synchronous version
    }

    // Other class functions here
}

/**
 * Override the toString method. Make a copy of the current object and 
 * delete the password from it, to avoid sending the password to the caller.
 * This only works when calling console.log(User.toString())! 
 * Using console.log(User) will still print the complete object including 
 * the (encrypted) password!
 * 
 * We use a regular function here instead of a fat-arrow function, since 
 * a fat-arrow (lambda) expression has no access to 'this', which we do need here.
 */
User.prototype.toString = function userToString() {
    var copy = Object.assign({}, this);
    delete copy.password
    return copy
}

module.exports = User;