
var plan = require('./planning.js');
var rdv = require('./rdv.js');
var parical = require('./parser_ical.js');
var fs = require('fs');

/*
fs.readFile("files/cc1.ics", "utf8", function (err, data) {  //chemin_fichier_ical
    if (err) {
        console.log("Erreur, Impossible de lire le fichier " + err);
        var exec = require("child_process").exec;
        exec("pwd", function (error, stdout, stderr) {
            console.log("le fichier ne se trouve peut-être pas dans le repertore " + stdout);
        });
    }
    else {
        var parseur = new parical.IcalParser();
        parseur.parse(data);
        var inter = new Intervenant('Troyes', 'jj', 'fire', parseur.parsedPlanning.listeRdv);
        //var inter = new Intervenant('pp', 'jj', 'fire', parseur.parsedPlanning.listeRdv);
        console.log("\n\t" + "Test de js intervenant");
        console.log(inter.getNom());
        console.log(inter.getPrenom());
        console.log(inter.getTravail());
        console.log(inter.planning);
    }
});
 ** 
 **/
//constructeur d'objet intervenant
var Intervenant = function (nom, prenom, travail, planning) {
    this.nom = nom;
    this.prenom = prenom;
    this.travail = travail;
    this.planning = this.findAllRdv(planning);
};

//return nom d'intervenant
Intervenant.prototype.getNom = function () {
    return this.nom;
};

//return prenom d'intervenant
Intervenant.prototype.getPrenom = function () {
    return this.prenom;
};

//return le travail d'intervenant
Intervenant.prototype.getTravail = function () { 
    return this.travail;
};

//return le planning qui contient juste des travails d'intervant
Intervenant.prototype.getPlanning = function () { 
    return this.planning;
};

//return si le rdv appartient a cet intervenant, si oui, retourne le resultat
Intervenant.prototype.checkRdv = function (rdv) {
    if (rdv.getIntervenant() == this.getNom()) {
        return rdv;
    }
    else
        return false;
};

//trouver tous les rdv d'intervenant d'un planning
Intervenant.prototype.findAllRdv = function (planning) {
    var tmpPlanning = new plan.Planning();
    //console.log(planning.length);
    for (var i = 0; i < planning.length; i++) {
        if (this.checkRdv(planning[i])) {
            tmpPlanning.addRdv(this.checkRdv(planning[i]));
            //console.log("trouver un rdv de " + planning[i].getIntervenant());
        }
    }
    return tmpPlanning;
};
    
exports.Intervenant = Intervenant;

