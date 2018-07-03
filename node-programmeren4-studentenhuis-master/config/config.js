//
// Application configuration
//
'use strict';

// Set the logging level.
const loglevel = process.env.LOGLEVEL || 'trace'
const secretkey = process.env.SECRETKEY || 'secret'

module.exports = {
    secretkey: secretkey,

    dbHost: 'localhost',
    dbUser: 'root',
    dbDatabase: 'spullendelen',
    webPort: 3000,

    logger: require('tracer')
        .console({
            format: [
                "{{timestamp}} <{{title}}> {{file}}:{{line}} : {{message}}"
            ],
            preprocess: function (data) {
                data.title = data.title.toUpperCase();
            },
            dateformat: "isoUtcDateTime",
            level: loglevel
        })
}