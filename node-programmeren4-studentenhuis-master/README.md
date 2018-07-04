# Nodejs Programmeren 4 tentamen - categorie
Nodejs server die een api biedt voor functionaliteit rond users, categorieen, spullenen en delers aan een spullen. Users kunnen zich registreren en een categorie maken. Binnen een categorie kan een spullen gemaakt worden. Andere users kunnen deelnemen aan een spullen. De app maakt gebruik van een MySQL database.

## Documentation
See the Swagger documentation on [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/) and online on [Heroku](https://mee-eten.herokuapp.com/api-docs/).

## Contents
This server contains:
1. Express routing and error handling via next()
2. JavaScript classes for OO-like programming
3. Many async functions illustrating async behavior of Nodejs
4. JWT authentication
5. Extensive validation of properties through asserts
6. Hashed passwords using bcrypt
7. Examples of BDD testcases using [Mocha](https://mochajs.org/), [Chai](http://www.chaijs.com/) and [Should](http://www.chaijs.com/api/bdd/)
8. Tests are run online on [Travis CI](https://travis-ci.org/avansinformatica/node-basic-server)
9. Swagger documentation

## Requirements
- nodejs 
- MySql 

## Usage
- Fork this repo and clone your copy onto your local machine.
- Import the categorie.sql script into your MySQL database.

Then run

```
npm install
npm start
```

For testing:
```
npm test
```

