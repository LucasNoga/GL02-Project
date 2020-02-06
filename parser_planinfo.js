/* fichier qui permet de parser un fichier PlanInfo */

var pl = require("./planning");
var rdv = require("./rdv");
var cli = require("./client");
var fs = require("fs");


//ajouer condition : si le nombre total de ligne est différent de 50 --> erreur
// 48 lignes d'horaires, 1 pour les jours et 1 pour la personne
var parser_planinfo = function (chemin_fichier_planinfo)  {
    fs.readFile("files/cvsTest.csv", "utf8", function(err, data){
        if(err){
            console.log("Erreur, Impossible de lire le fichier "+ err);
            var exec = require("child_process").exec;
            exec("pwd", function (error, stdout, stderr) {
                console.log("le fichier ne se trouve peut-ĂŞtre pas dans le repertoire "+stdout);
            });
        }
        else{
            var parseur = new PlanInfoParser();
            parseur.parse(data);

            //AFFICHAGE DU PLANNING
            console.log(parseur.planning);
        }
    });
};


// Il faut séparer les données du fichier au format PlanInfo
var PlanInfoParser = function() {
	this.planning = new pl.Planning();
	this.symb = ["###","--",";"]
	this.debut; //on la première ligne qu'on récuperera plus tard pour domicile d'une personne (planning de domicile)

}

//cherche chaque info et la met dans une liste <eol> = CRLF
PlanInfoParser.prototype.tokenize = function(data) {
	var separator = /(\r\n|\n|;)/; //separateur des données
	data = data.split(separator);
	data = data.filter(function(val, idx){
		return !val.match(separator);
	                  });
	return data;

}

/**EXPLIQUER LA METHODE*/
PlanInfoParser.prototype.parse = function(data) {
	
	var tDataLundi = [];
	var tDataMardi = [];
	var tDataMercredi = [];
	var tDataJeudi = [];
	var tDataVendredi = [];
	var tDataSamedi = [];
	var tDataDimanche = [];


	var ligne=0;

	var tData = this.tokenize(data)
	// il faut sauter la première ligne, i = 0 a 6 + le premier element qui correpond aux données principale (titre)
	for ( i=8; i<tData.length; i++) {
		tDataLundi[ligne] = tData[i];
		tDataMardi[ligne] = tData[++i];
		tDataMercredi[ligne] = tData[++i];
		tDataJeudi[ligne] = tData[++i];
		tDataVendredi[ligne] = tData[++i];
		tDataSamedi[ligne] = tData[++i];
		tDataDimanche[ligne] = tData[++i];
		ligne++
	}

	this.debut = tData[0];



	this.listPlanInfoDomicile([tDataLundi,tDataMardi,tDataMercredi,tDataJeudi,tDataVendredi,tDataSamedi,tDataDimanche]);
    //this.listPlanInfoIntervenant....

	//console.log(tDataXXXXX);
	//this.listPlanInfo(tDataXXXXX);
}

//Parser operand
PlanInfoParser.prototype.err = function(msg, input) {
		console.log("Parsing Error ! on "+input[0]+" -- msg : "+msg);
	process.exit(0);

}

// methode pour retourner une donnée parser
PlanInfoParser.prototype.next = function(input) {
	var curS = input.shift(s);
	//console.log(curS);
	return curS;
}

// check si la tête de liste est bien un symbole
PlanInfoParser.prototype.accept = function(s) {
	var idx = this.symb.indexOf(s);
	if ( idx === -1) {
		this.err("Symbole " + s + " est inconnu.", [" "]);
		return false;
	}
	return idx;
}

//verifie que le premier symbole soit le bon
PlanInfoParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		//console.log("Reconnu! "+s)
		return true;
	}else{
		this.err("le symbole "+s+" ne correspond pas", input);
	}
	return false;
}

/**EXPLIQUER LA METHODE*/
PlanInfoParser.prototype.listPlanInfoDomicile = function(input) {

	var adresse = this.debut.split("--");
	var lieu = adresse[1];
	lieu = lieu.replace("\"", '');

	tDataLundi = input[0];
	tDataMardi = input[1];
	tDataMercredi = input[2];
	tDataJeudi = input[3];
	tDataVendredi = input[4];
	tDataSamedi = input[5];
	tDataDimanche = input[6];
    
	//chercher les rdv en évitant les cases vides
	for (i=0; i<tDataLundi.length; i++) {
		if ( tDataLundi[i] !="vide") {
			var elem = tDataLundi[i].split(" ");
			var titre = elem[0];   //recupere le titre de l'intervenant
            var intervenant = elem[1] + " " +  elem[2];
            //Faire une expression regulierer pour recuperer le texte entre les parentheses
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); 
			date = "Lundi";
			duree = 000036; //Creer un objet de type Date
			lieu = lieu; //comment récuperer la premiere ligne ? "l'input[0]" pour l'adresse
		    this.creerRdvDomicile(titre, intervenant, date, duree, lieu);
		}
	}
	
	for (i=0; i<tDataMardi.length; i++) {
		if ( tDataMardi[i] !="vide") {
			var elem = tDataMardi[i].split(" ");
			var titre = elem[0];   //recupere le titre de l'intervenant
            var intervenant = elem[1] + " " +  elem[2];
            //Faire une expression regulierer pour recuperer le texte entre les parentheses
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); 
			date = "Mardi";
			duree = 000036; //Creer un objet de type Date
			lieu = lieu;
		    this.creerRdvDomicile(titre, intervenant, date, duree, lieu);
		}
	}
	
	for (i=0; i<tDataMercredi.length; i++) {
		if ( tDataMercredi[i] !="vide") {
			var elem = tDataMercredi[i].split(" ");
			var titre = elem[0];   //recupere le titre de l'intervenant
            var intervenant = elem[1] + " " +  elem[2]; //apparition d'un undefined incomprehensible 
            //Faire une expression regulierer pour recuperer le texte entre les parentheses
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); 
			date = "Mercredi";
			duree = 000036; //Creer un objet de type Date
			lieu = lieu;
		    this.creerRdvDomicile(titre, intervenant, date, duree, lieu);
		}
	}

	for (i=0; i<tDataJeudi.length; i++) {
		if ( tDataJeudi[i] !="vide") {
			var elem = tDataJeudi[i].split(" ");
			var titre = elem[0];   //recupere le titre de l'intervenant
            var intervenant = elem[1] + " " +  elem[2];
            //Faire une expression regulierer pour recuperer le texte entre les parentheses
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); 
			date = "Jeudi";
			duree = 000036; //Creer un objet de type Date
			lieu = lieu;
		    this.creerRdvDomicile(titre, intervenant, date, duree, lieu);
		}
	}

	for (i=0; i<tDataVendredi.length; i++) {
		if ( tDataVendredi[i] !="vide") {
			var elem = tDataVendredi[i].split(" ");
			var titre = elem[0];   //recupere le titre de l'intervenant
            var intervenant = elem[1] + " " +  elem[2];
            //Faire une expression regulierer pour recuperer le texte entre les parentheses
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); 
			date = "Vendredi";
			duree = 000036; //Creer un objet de type Date
			lieu = lieu;
		    this.creerRdvDomicile(titre, intervenant, date, duree, lieu);
		}
	}

	for (i=0; i<tDataSamedi.length; i++) {
		if ( tDataSamedi[i] !="vide") {
			var elem = tDataSamedi[i].split(" ");
			var titre = elem[0];   //recupere le titre de l'intervenant
            var intervenant = elem[1] + " " +  elem[2];
            //Faire une expression regulierer pour recuperer le texte entre les parentheses
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); 
			date = "Samedi";
			duree = 000036; //Creer un objet de type Date
			lieu = lieu;
		    this.creerRdvDomicile(titre, intervenant, date, duree, lieu);
		}
	}

	for (i=0; i<tDataDimanche.length; i++) {
		if ( tDataDimanche[i] !="vide") {
			var elem = tDataDimanche[i].split(" ");
			var titre = elem[0];   //recupere le titre de l'intervenant
            var intervenant = elem[1] + " " +  elem[2];
            //Faire une expression regulierer pour recuperer le texte entre les parentheses
            intervenant = intervenant.replace(')', '');
            intervenant = intervenant.replace('(', ''); 
			date = "Dimanche";
			duree = 000036; //Creer un objet de type Date
			lieu = lieu;
		    this.creerRdvDomicile(titre, intervenant, date, duree, lieu);
		}
	}
}

/**EXPLIQUER LA METHODE*/
PlanInfoParser.prototype.listPlanInfoIntervenant = function(input) {


}


//fonction planning qui retourne les rdv



/*fonction qui permet de créer le rendezvous pour un domicile*/
PlanInfoParser.prototype.creerRdvDomicile = function(titre, intervenant, date, duree, lieu) {
    //console.log(titre + " " +intervenant + " " + date + " " + duree + " " + lieu);
   var test = new rdv.RendezVous(titre, intervenant, new Date(2016, 1, 04, 00, 30, 00, 000), duree, lieu)
   //return new rdv.RendezVous(titre, intervenant, date-heure, duree, lieu);
   this.planning.addRdv(test);
};

//méthode pour creer un rdv
parser_planinfo("files/cvsTest.csv");


module.exports.PlanInfoParser = PlanInfoParser;