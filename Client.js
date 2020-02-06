/**
 * Created by adam on 23/11/16.
 */
var planning = require("./planning");
/**
 * @constructor Client
 * Crée un objet Client, en spécifiant son nom, prenom, adresse et planning
 *
 * @param nom
 * Un String pour le nom du client
 * @param prenom
 * Un String pour le prénom du client
 * @param adresse
 * Un String pour l'adresse du client
 * @param planning
 * Un objet planning associé au Client
 */
var Client = function(nom, prenom, adresse, planning){
    this.nom = nom;
    this.prenom = prenom;
    this.adresse = adresse;
    this.planning = planning;
}

exports.Client = Client;
