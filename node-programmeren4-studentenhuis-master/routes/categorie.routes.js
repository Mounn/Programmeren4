//
// routes.js
//
'use strict';

let routes = require('express').Router()
const categorieController = require('../controllers/categorie.controller')
const SpullenController = require('../controllers/spullen.controller')
const DelerController = require('../controllers/delers.controller')
const UploadController = require('../controllers/upload.controller')

/**
 * @typedef ApiError
 * @property {string} message.required - De tekst van de foutmelding.
 * @property {number} code.required - HTTP error code
 * @property {string} datetime.required - De datum en tijd in ISO notatie.
 */

/**
 * @typedef categorie
 * @property {string} naam.required - De naam van het categorie
 * @property {string} adres.required - Straatnaam en huisnummer van het categorie
 * @property {string} lat.required - Latitude Geo coördinaten van het categorie
 * @property {string} long.required - Longitude Geo coördinaten van het categorie
 * @property {string} image - Optionele afbeelding van het categorie
 */

/**
 * @typedef categorieResponse
 * @property {number} ID.required - De ID van het categorie
 * @property {string} naam.required - De naam van het categorie
 * @property {string} adres.required - Straatnaam en huisnummer van het categorie
 * @property {string} contact.required - De voor en achternaam van de gebruiker die het categorie heeft aangemaakt.
 * @property {string} email.required - Email van de gebruiker die het categorie heeft aangemaakt.
 * @property {string} lat.required - Latitude Geo coördinaten van het categorie
 * @property {string} long.required - Longitude Geo coördinaten van het categorie
 * @property {string} image - Afbeelding van het categorie
 */

/**
 * @typedef Spullen
 * @property {string} naam.required - Naam van de spullen
 * @property {string} beschrijving.required - Korte beschrijving van de spullen.
 * @property {string} merk.required - Merk van de spullen, komma gescheiden.
 * @property {string} soort.required - Soort informatie van de spullen.
 * @property {number} bouwjaar.required - Bouwjaar van de spullen (alleen gehele getallen).
 * @property {string} image - Afbeelding van de spullen
 */

/**
 * @typedef SpullenResponse
 * @property {number} ID.required - De ID van de spullen
 * @property {string} naam.required - Naam van de spullen
 * @property {string} beschrijving.required - Korte beschrijving van de spullen.
 * @property {string} merk.required - Merk van de spullen, komma gescheiden.
 * @property {string} soort.required - Soort informatie van de spullen.
 * @property {number} bouwjaar.required - Bouwjaar van de spullen (alleen gehele getallen).
 * @property {string} image - Afbeelding van de spullen
 */

/**
 * @typedef DelerResponse
 * @property {string} voornaam.required
 * @property {string} achternaam.required
 * @property {string} email.required
 * @property {string} image - Afbeelding van de deler
 */

/**
 * Maak een nieuw categorie. De ID van de gebruiker die het categorie aanmaakt wordt bij het
 * categorie opgeslagen. Deze ID haal je uit het JWT token.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route POST /api/categorie
 * @group categorie - Endpoints voor CRUD functionaliteit op een categorie.
 * @param {categorie.model} categorie.body.required - Een object in de request body met de gegevens van het categorie.
 * @returns {categorieResponse.model} 200 - Het toegevoegde categorie met ID en gebruikersinfo
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.post('/categorie', categorieController.create)

/**
 * Vervang het categorie met de gegeven huisId door de informatie van het categorie
 * dat in de body is meegestuurd. Alleen de gebruiker die het categorie heeft aangemaakt
 * mag de informatie van dat categorie wijzigen.
 * Deze ID haal je uit het JWT token.
 * Als er geen categorie met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route PUT /api/categorie/{huisId}
 * @group categorie - Endpoints voor CRUD functionaliteit op een categorie.
 * @param {categorie.model} categorie.body.required - De nieuwe informatie over het categorie
 * @returns {categorieResponse.model} 200 - Het gewijzigde (nieuwe) categorie
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet wijzigen)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.put('/categorie/:huisId', categorieController.update)

/**
 * Verwijder het categorie met de gegeven huisId.
 * Als er geen categorie met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
 * Een gebruiker kan alleen een categorie verwijderen als hij dat zelf heeft aangemaakt.
 * Deze ID haal je uit het JWT token.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route DELETE /api/categorie/{huisId}
 * @group categorie - Endpoints voor CRUD functionaliteit op een categorie.
 * @returns {object} 200 - Info dat de verwijdering is gelukt.
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet verwijderen)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.delete('/categorie/:huisId', categorieController.delete)

/**
 * Maak een nieuwe spullen voor een categorie. De ID van de gebruiker die de spullen
 * aanmaakt wordt opgeslagen bij de spullen.
 * Deze ID haal je uit het JWT token.
 * Als er geen categorie met de gevraagde huisId bestaat wordt een juiste foutmelding geretourneerd.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden. 
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist.
 * 
 * @route POST /api/categorie/{huisId}/spullen
 * @group Spullen - Endpoints voor CRUD functionaliteit op een spullen.
 * @param {Spullen.model} spullen.body.required - Een object in de request body met de gegevens van de spullen
 * @returns {SpullenResponse.model} 200 - De spullen die toegevoegd is
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId bestaat niet)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.post('/categorie/:huisId/spullen', SpullenController.create)

/**
 * Vervang de spullen met het gegeven spullenId door de nieuwe spullen in de request body.
 * Als er geen categorie of spullen met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * Alleen de gebruiker die de spullen heeft aangemaakt kan deze wijzigen.
 * De ID van de gebruiker haal je uit het JWT token.
 * De correctheid van de informatie die wordt gegeven moet door de server gevalideerd worden.
 * Bij ontbrekende of foutieve invoer wordt een juiste foutmelding geretourneerd.
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route PUT /api/categorie/{huisId}/spullen/{spullenId}
 * @group Spullen - Endpoints voor CRUD functionaliteit op een spullen.
 * @param {Spullen.model} spullen.body.required - De nieuwe spullen
 * @returns {SpullenResponse.model} 200 - De bijgewerkte spullen
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of spullenId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet wijzigen)
 * @returns {ApiError.model}  412 - Een of meer properties in de request body ontbreken of zijn foutief 
 */
routes.put('/categorie/:huisId/spullen/:spullenId', SpullenController.update)

/**
 * Verwijder de spullen met het gegeven spullenId.
 * Als er geen categorie of spullen met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * Alleen de gebruiker die de spullen heeft aangemaakt kan deze wijzigen.
 * De ID van de gebruiker haal je uit het JWT token.
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route DELETE /api/categorie/{huisId}/spullen/{spullenId}
 * @group Spullen - Endpoints voor CRUD functionaliteit op een spullen.
 * @returns {object} 200 - Info over de status van de verwijderactie
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of spullenId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet verwijderen)
 */
routes.delete('/categorie/:huisId/spullen/:spullenId', SpullenController.delete)

/**
 * Meld je aan voor een spullen in een categorie.
 * Als er geen categorie of spullen met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * De user ID uit het token is dat van de gebruiker die zich aanmeldt. 
 * Die gebruiker wordt dus aan de lijst met aanmelders toegevoegd. 
 * Een gebruiker kan zich alleen aanmelden als hij niet al aan de spullen deelneemt;
 * anders volgt een foutmelding.
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route POST /api/categorie/{huisId}/spullen/{spullenId}/delers
 * @group Delers - Endpoints voor CRD functionaliteit op een deler aan een spullen.
 * @returns {DelerResponse.model} 200 - Informatie over de toegevoegde deler
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of spullenId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker is al aangemeld)
 */
routes.post('/categorie/:huisId/spullen/:spullenId/delers', DelerController.create)

/**
 * Verwijder een deler.
 * Als er geen categorie of spullen met de gevraagde Id bestaat wordt een juiste foutmelding geretourneerd.
 * De deler die wordt verwijderd is de gebruiker met het ID uit het token.
 * Een gebruiker kan alleen zijn eigen aanmelding verwijderen. 
 * Authenticatie door middel van JWT is vereist. 
 * 
 * @route DELETE /api/categorie/{huisId}/spullen/{spullenId}/delers
 * @group Delers - Endpoints voor CRD functionaliteit op een deler aan een spullen.
 * @returns {object} 200 - Informatie over de verwijderactie
 * @returns {ApiError.model}  401 - Niet geautoriseerd (geen valid token)
 * @returns {ApiError.model}  404 - Niet gevonden (huisId of spullenId bestaat niet)
 * @returns {ApiError.model}  409 - Conflict (Gebruiker mag deze data niet verwijderen)
 */
routes.delete('/categorie/:huisId/spullen/:spullenId', DelerController.delete)

module.exports = routes