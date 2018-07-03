//
// routes.js
//
'use strict';

let routes = require('express').Router()
const StudentenhuisController = require('../controllers/studentenhuis.controller')
const MaaltijdController = require('../controllers/maaltijd.controller')
const DeelnemerController = require('../controllers/deelnemer.controller')

/**
 * @typedef ApiError
 * @property {string} message.required - De tekst van de foutmelding.
 * @property {number} code.required - HTTP error code
 * @property {string} datetime.required - De datum en tijd in ISO notatie.
 */

/**
 * @typedef Studentenhuis
 * @property {string} naam.required - De naam van het studentenhuis
 * @property {string} adres.required - Straatnaam en huisnummer van het studentenhuis
 * @property {string} lat.required - Latitude Geo coördinaten van het studentenhuis
 * @property {string} long.required - Longitude Geo coördinaten van het studentenhuis
 * @property {string} image - Optionele afbeelding van het studentenhuis
 */

/**
 * @typedef StudentenhuisResponse
 * @property {number} ID.required - De ID van het studentenhuis
 * @property {string} naam.required - De naam van het studentenhuis
 * @property {string} adres.required - Straatnaam en huisnummer van het studentenhuis
 * @property {string} contact.required - De voor en achternaam van de gebruiker die het studentenhuis heeft aangemaakt.
 * @property {string} email.required - Email van de gebruiker die het studentenhuis heeft aangemaakt.
 * @property {string} lat.required - Latitude Geo coördinaten van het studentenhuis
 * @property {string} long.required - Longitude Geo coördinaten van het studentenhuis
 * @property {string} image - Afbeelding van het studentenhuis
 */

/**
 * @typedef Maaltijd
 * @property {string} naam.required - Naam van de maaltijd
 * @property {string} beschrijving.required - Korte beschrijving van de maaltijd.
 * @property {string} ingredienten.required - Ingredienten van de maaltijd, komma gescheiden.
 * @property {string} allergie.required - Allergie informatie van de maaltijd.
 * @property {number} prijs.required - Prijs van de maaltijd (alleen gehele getallen).
 * @property {string} image - Afbeelding van de maaltijd
 */

/**
 * @typedef MaaltijdResponse
 * @property {number} ID.required - De ID van de maaltijd
 * @property {string} naam.required - Naam van de maaltijd
 * @property {string} beschrijving.required - Korte beschrijving van de maaltijd.
 * @property {string} ingredienten.required - Ingredienten van de maaltijd, komma gescheiden.
 * @property {string} allergie.required - Allergie informatie van de maaltijd.
 * @property {number} prijs.required - Prijs van de maaltijd (alleen gehele getallen).
 * @property {string} image - Afbeelding van de maaltijd
 */

/**
 * @typedef DeelnemerResponse
 * @property {string} voornaam.required
 * @property {string} achternaam.required
 * @property {string} email.required
 * @property {string} image - Afbeelding van de deelnemer
 */

/**
 * Retourneer een lijst met alle studentenhuizen. Iedere gebruiker kan alle studentenhuizen opvragen.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route GET /api/studentenhuis
 * @group Studentenhuis - Endpoints voor CRUD functionaliteit op een studentenhuis.
 * @returns {StudentenhuisResponse.model} 200 - Een array met studentenhuizen.
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 */
routes.get('/studentenhuis', StudentenhuisController.getAll)

/**
 * Retourneer het studentenhuis met de gegeven huisId. Iedere gebruiker kan alle studentenhuizen opvragen.
 * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.  
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route GET /api/studentenhuis/{huisId}
 * @group Studentenhuis - Endpoints voor CRUD functionaliteit op een studentenhuis.
 * @returns {StudentenhuisResponse.model} 200 - Het studentenhuis met de gegeven huisId.
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 */
routes.get('/studentenhuis/:huisId', StudentenhuisController.getById)

/**
 * Retourneer alle maaltijden voor het studentenhuis met de gegeven huisId. 
 * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
 * Iedere gebruiker kan alle maaltijden van alle studentenhuizen opvragen. 
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route GET /api/studentenhuis/{huisId}/maaltijd
 * @group Maaltijd - Endpoints voor CRUD functionaliteit op een maaltijd.
 * @returns {MaaltijdResponse.model} 200 - Een array met alle maaltijden van het gegeven studentenhuis
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 */
routes.get('/studentenhuis/:huisId/maaltijd', MaaltijdController.getAll)

/**
 * Retourneer de maaltijd met het gegeven maaltijdId.
 * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * Iedere gebruiker kan alle maaltijden van alle studentenhuizen opvragen.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route GET /api/studentenhuis/{huisId}/maaltijd/{maaltijdId}
 * @group Maaltijd - Endpoints voor CRUD functionaliteit op een maaltijd.
 * @returns {MaaltijdResponse.model} 200 - De gevraagde maaltijdinformatie
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 */
routes.get('/studentenhuis/:huisId/maaltijd/:maaltijdId', MaaltijdController.getMaaltijdById)

/**
 * Geef de lijst met deelnemers voor de maaltijd met gegeven maaltijdID in het studentenhuis met huisId. 
 * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * Deelnemers zijn geregistreerde gebruikers die zich hebben aangemeld voor deze maaltijd.
 * Iedere gebruiker kan alle deelnemers van alle maaltijden in alle studentenhuizen opvragen.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route GET /api/studentenhuis/{huisId}/maaltijd/{maaltijdId}/deelnemers
 * @group Deelnemers - Endpoints voor CRD functionaliteit op een deelnemer aan een maaltijd.
 * @returns {DeelnemerResponse.model} 200 - Een array met deelnemers aan de gegeven maaltijd in het gegeven studentenhuis.
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of maaltijdId bestaat niet)
 */
routes.get('/studentenhuis/:huisId/maaltijd/:maaltijdId/deelnemers', DeelnemerController.getAll)

module.exports = routes