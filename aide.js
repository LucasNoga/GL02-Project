/**
 * @constructor
 * Crée un objet Aide qui permet d'afficher le readme ou bien d'aaficher lalliste des commandes disponibles en cas d'erreur
 */

/*Import*/
var fs = require("fs");

/**Constructeur pour l'aide*/
var Aide = function(){}

/**affiche le fichier readme*/
Aide.prototype.afficherAide = function(){
    console.log("\n\n\n\t\t\t\t\t\t\t\t\t\t\tAffichage du README\n\n");
    fs.readFile("../README.md", "utf-8", function(err, data){
        if (err)
            return console.log(err);
        else
            console.log(data);
    });
};


/**Dans le cas ou la commande saisi est incorrecte on affiche la liste des commandes possibles*/
Aide.prototype.affichageFausseCommande = function() {
    console.error("Main : La commande saisie est inconnue.");
    console.log("voici la liste des commandes possibles");

    ///////////////AFFICHER L'ensemble des commandes
    console.log("Consultez le fichier README.txt pour obtenir la liste des commandes.");
};

var aide = new Aide();
module.exports = aide; //exporation de l'objet
