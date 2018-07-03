const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

const endpointToTest = '/api/studentenhuis'

describe('Studentenhuis API POST', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        /**
           * require('authentication.test') forces that test to be run before our tests.
           * That provides us with a valid token that we use for authentication our requests.
           */
        const token = require('./authentication.test').token
        chai.request(server)
            .post(endpointToTest)
            .set('x-access-token', token)
            .send({
                'naam': '  Huize Avans  ',
                'adres': '  Lovensdijkstraat 61   '
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                // const huis = res.body
                // huis.should.have.property('ID')
                // huis.should.have.property('naam').equals('Huize Avans')
                // huis.should.have.property('adres')
                // huis.should.have.property('contact')
                // huis.should.have.property('email')
                // huis.should.not.have.property('password')


                // {
                //     "status": {
                //         "fieldCount": 0,
                //         "affectedRows": 1,
                //         "insertId": 6,
                //         "serverStatus": 2,
                //         "warningCount": 0,
                //         "message": "",
                //         "protocol41": true,
                //         "changedRows": 0
                //     }
                // }

                done()
            })
    })

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})

describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return all studentenhuizen when using a valid token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})

describe('Studentenhuis API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return an error when using an non-existing huisId', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})

describe('Studentenhuis API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})

describe('Studentenhuis API DELETE', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})