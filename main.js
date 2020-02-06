/*fichier principale, qui gere les option en ligne de commande*/

var Aide = require("./aide")
var rdv = require("./rdv");
var parical = require("./parser_ical");
var fs = require("fs");

var arguments = process.argv.slice(2);
var commande = process.argv[2];


console.log("\t\t\t\t\t\t\t\t\t\t\tLibrairie Javascript Yadom");
console.log("voici les commandes qui vous sont proposé")

if(arguments.length == 0){
    console.log("vous n'avez pas saisi de commande ou d'arguments après node main.js");
    console.log("voici la liste des commandes et argument");
    console.log("\thelp - permet d'afficher le fichier Readme de cette librairie");
    //Saisir les autre commandes


}else{
    switch(arguments[0].toLowerCase()) {
        case "help":
            Aide.afficherAide();
            break;
        case "version":
            var version = "1.0";
            console.log("main version: " + version);
            break;
        case "csvtoical":
            csvtoical(arguments.slice(1));
            break;
        case "union":
            faireUnion(arguments.slice(1));
            break;
        case "complementaire":
            faireComplementaire(arguments.slice(1));
            break;
        case "intersection":
            faireIntersection(arguments.slice(1));
            break;
        case "rapport":
            faireRapportIntervention(arguments.slice(1));
            break;
        default:
            Aide.affichageFausseCommande();
            break;
    }
}

/**
 * Faire la Fonction qui effectue la conversion d'un CSV en ical.
 function csvtoical = function(argumentsCommande) {*/


/*Faire l'union de 2 fichiers
var faireUnion = function(argumentsCommande){*/

/*Faire le complémentaire de 2 fichiers
var faireComplementaire = function(argumentsCommande){*/

/*Faire l'intersection de 2 fichiers
var faireIntersection = function(argumentsCommande){*/

/*Faire un rapport entre un fichier ics et csv
/*var faireRapportIntervention = function(argumentsCommande) {*/

/*1)detectConflict (nomPlanning,nomPlanning,...): Détecte les conflit dans la liste des plannings.
(SPEC 1)
2) showConflit(): Affiche les conflits détectés. (SPEC 2)
3) import (filePath): Importe dans le logiciel le fichier dont le
chemin est spécifié. L’enregistre dans un objet dont le nom(nomPlannig) sera le nom du fichier.
Optionnel: Détectele format du fichier sinon utiliser deux commandes (importPlanInfo()
et importiCal). (SPEC 3 et 5)
4) exportPlanInfo(nomPlanning): enregistre le planning en paramètre au format PlanInfo.
5) exportiCal(nomPlanning): enregistre le planning en paramètre au format iCal.
*/

