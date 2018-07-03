//
// routes.js
//
'use strict';

let routes = require('express').Router()
const StudentenhuisController = require('../controllers/studentenhuis.controller')
const MaaltijdController = require('../controllers/maaltijd.controller')
const DeelnemerController = require('../controllers/deelnemer.controller')
const UploadController = require('../controllers/upload.controller')

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
 * Maak een nieuw studentenhuis. De ID van de gebruiker die het studentenhuis aanmaakt wordt bij het 
 * studentenhuis opgeslagen. Deze ID haal je uit het JWT token.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route POST /api/studentenhuis
 * @group Studentenhuis - Endpoints voor CRUD functionaliteit op een studentenhuis.
 * @param {Studentenhuis.model} studentenhuis.body.required - Een object in de request body met de gegevens van het studentenhuis.
 * @returns {StudentenhuisResponse.model} 200 - Het toegevoegde studentenhuis met ID en gebruikersinfo
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.post('/studentenhuis', StudentenhuisController.create)

/**
 * Vervang het studentenhuis met de gegeven huisId door de informatie van het studentenhuis 
 * dat in de body is meegestuurd. Alleen de gebruiker die het studentenhuis heeft aangemaakt
 * mag de informatie van dat studenenhuis wijzigen.
 * Deze ID haal je uit het JWT token.
 * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route PUT /api/studentenhuis/{huisId}
 * @group Studentenhuis - Endpoints voor CRUD functionaliteit op een studentenhuis.
 * @param {Studentenhuis.model} studentenhuis.body.required - De nieuwe informatie over het studentenhuis
 * @returns {StudentenhuisResponse.model} 200 - Het gewijzigde (nieuwe) studentenhuis
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet wijzigen)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.put('/studentenhuis/:huisId', StudentenhuisController.update)

/**
 * Verwijder het studentenhuis met de gegeven huisId.
 * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
 * Een gebruiker kan alleen een studentenhuis verwijderen als hij dat zelf heeft aangemaakt.
 * Deze ID haal je uit het JWT token.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route DELETE /api/studentenhuis/{huisId}
 * @group Studentenhuis - Endpoints voor CRUD functionaliteit op een studentenhuis.
 * @returns {object} 200 - Info dat de verwijdering is gelukt.
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet verwijderen)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.delete('/studentenhuis/:huisId', StudentenhuisController.delete)

/**
 * Maak een nieuwe maaltijd voor een studentenhuis. De ID van de gebruiker die de maaltijd
 * aanmaakt wordt opgeslagen bij de maaltijd. 
 * Deze ID haal je uit het JWT token.
 * Als er geen studentenhuis met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route POST /api/studentenhuis/{huisId}/maaltijd
 * @group Maaltijd - Endpoints voor CRUD functionaliteit op een maaltijd.
 * @param {Maaltijd.model} maaltijd.body.required - Een object in de request body met de gegevens van de maaltijd
 * @returns {MaaltijdResponse.model} 200 - De maaltijd die toegevoegd is
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.post('/studentenhuis/:huisId/maaltijd', MaaltijdController.create)

/**
 * Vervang de maaltijd met het gegeven maaltijdId door de nieuwe maaltijd in de request body.
 * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * Alleen de gebruiker die de maaltijd heeft aangemaakt kan deze wijzigen.
 * De ID van de gebruiker haal je uit het JWT token.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden.
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route PUT /api/studentenhuis/{huisId}/maaltijd/{maaltijdId}
 * @group Maaltijd - Endpoints voor CRUD functionaliteit op een maaltijd.
 * @param {Maaltijd.model} maaltijd.body.required - De nieuwe maaltijd
 * @returns {MaaltijdResponse.model} 200 - De bijgewerkte maaltijd
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of maaltijdId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet wijzigen)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.put('/studentenhuis/:huisId/maaltijd/:maaltijdId', MaaltijdController.update)

/**
 * Verwijder de maaltijd met het gegeven maaltijdId.
 * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * Alleen de gebruiker die de maaltijd heeft aangemaakt kan deze wijzigen.
 * De ID van de gebruiker haal je uit het JWT token.
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route DELETE /api/studentenhuis/{huisId}/maaltijd/{maaltijdId}
 * @group Maaltijd - Endpoints voor CRUD functionaliteit op een maaltijd.
 * @returns {object} 200 - Info over de status van de verwijderactie
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of maaltijdId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet verwijderen)
 */
routes.delete('/studentenhuis/:huisId/maaltijd/:maaltijdId', MaaltijdController.delete)

/**
 * Meld je aan voor een maaltijd in een studentenhuis. 
 * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * De user ID uit het token is dat van de gebruiker die zich aanmeldt. 
 * Die gebruiker wordt dus aan de lijst met aanmelders toegevoegd. 
 * Een gebruiker kan zich alleen aanmelden als hij niet al aan de maaltijd deelneemt; 
 * anders volgt een foutmelding.
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route POST /api/studentenhuis/{huisId}/maaltijd/{maaltijdId}/deelnemers
 * @group Deelnemers - Endpoints voor CRD functionaliteit op een deelnemer aan een maaltijd.
 * @returns {DeelnemerResponse.model} 200 - Informatie over de toegevoegde deelnemer
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of maaltijdId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker is al aangemeld)
 */
routes.post('/studentenhuis/:huisId/maaltijd/:maaltijdId/deelnemers', DeelnemerController.create)

/**
 * Verwijder een deelnemer.
 * Als er geen studentenhuis of maaltijd met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * De deelnemer die wordt verwijderd is de gebruiker met het ID uit het token.
 * Een gebruiker kan alleen zijn eigen aanmelding verwijderen. 
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route DELETE /api/studentenhuis/{huisId}/maaltijd/{maaltijdId}/deelnemers
 * @group Deelnemers - Endpoints voor CRD functionaliteit op een deelnemer aan een maaltijd.
 * @returns {object} 200 - Informatie over de verwijderactie
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of maaltijdId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet verwijderen)
 */
routes.delete('/studentenhuis/:huisId/maaltijd/:maaltijdId', DeelnemerController.delete)

module.exports = routes