/**Fichier qui permet de parser un fichier Ical*/
var pl = require("./planning");
var rdv = require("./rdv");
var fs = require("fs");


var parser_ical = function(file_ical){
    fs.readFile(file_ical, "utf8", function(err, data){  //chemin_fichier_ical
        if(err){
            console.log("Erreur, Impossible de lire le fichier "+ err);
            var exec = require("child_process").exec;
            exec("pwd", function (error, stdout, stderr) {
                console.log("le fichier ne se trouve peut-être pas dans le repertore "+stdout);
            });
        }
        else{
            var parseur = new IcalParser();
            parseur.parse(data);
            console.log(parseur.planning);
        }
    });
};

parser_ical("files/iCal1.ics");////////////////////////APPEL DU PARSER

/** @constructor IcalParser est objet qui permet de separer les données d'un fichier Ical*/
var IcalParser = function(){
	this.planning = new pl.Planning();
	this.symb = [
        "BEGIN",
        "VCALENDAR",
        "VEVENT",
        "SUMMARY",
        "LOCATION",
        "DTSTART",
        "DTEND",
        "END",
    ];
}


/**transforme le fichier Ical en liste <eol> = CRLF*/
IcalParser.prototype.tokenize = function(data){
	var separator = /(\r\n|\n|:)/; //on recupere dans un tableau chaine par chaine
	data = data.split(separator);
	data = data.filter(function(val, idx){
        return !val.match(separator);
	});
	return data;
}

/**La méthode parse analyse les données en récupérant les symboles non terminaux de la grammaire*/
IcalParser.prototype.parse = function(data){
	var tData = this.tokenize(data);
	this.listVEvent(tData);
}

// Parser operand
IcalParser.prototype.err = function(msg, input){
	console.log("Parsing Error ! on "+input[0]+" -- msg : "+msg);
	process.exit(0);
}

/**Parcours le tableau parse, retourne et retire le premier element de ce tableau
* @param input tableau parsé
* @return curS premier element du tableau
*/
IcalParser.prototype.next = function(input){
	var curS = input.shift();
	return curS;
}

/**La méthode accept permet de verifier si la tete de liste correspond à un des symboles du langage*/
IcalParser.prototype.accept = function(s){
	if(s !== undefined){
		var idx = this.symb.indexOf(s);
		if(idx === -1){
			this.err("symbol "+s+" unknown", [" "]);
			return false;
		}
		return idx;
	}
}

/**La méthode check vérifie si l'argument en tête de liste est vérifié
* @param s la chaine attendues
* @param input[0] le premier element de la liste Ical parsé
*/
IcalParser.prototype.check = function(s, input){
	if(this.accept(input[0]) == this.accept(s)){
		return true;
	}
	return false;
}

/**La méthode isKnown verifie si l'argument en tête de liste est connue
* @param s la chaine attendus
* @param input
*/
IcalParser.prototype.isKnown = function(input) {
    var idx = this.symb.indexOf(input[0]);
    // index 0 exists
    if(idx === -1)
        return false;
    return true;
}

/**La méthode expect permet de detecter les chaines qu'on compare avec ceux qui sont attendus
* @param s la chaine attendus
* @param input liste du ICal parsé
*/
IcalParser.prototype.expect = function(s, input){
	if(s == this.next(input)){
		return true;
	}else{
		this.err("symbol "+s+" doesn't match", input);
	}
	return false;
}


/**Cette fonction supprime de la liste le begin et le end et conserve donc dans cette uniquement les events en les stockant dans des objets events
* @param input liste du ICal parsé
*/
IcalParser.prototype.listVEvent = function(input){
    //Début du fichier
    this.expect("BEGIN", input);
    this.expect("VCALENDAR", input);

    //tant que le premier element de la liste n'est pas un nouveau rendez-vous on traite ces données
    while(input[0] != "BEGIN"){
        this.next(input);
    }

    //Lecture du premier rdv
	this.vEvent(input);

    //Fin du fichier
    this.expect("END", input);
    this.expect("VCALENDAR", input);
    this.expect("", input) //enleve la chaine vide qu'il y a a la fin de chaque fichier iCal

}

/*permet de recuperer uniquement les données des rendez-vous*/
IcalParser.prototype.vEvent = function(input){
	if(this.check("BEGIN", input)){
		this.expect("BEGIN", input);
        if(input[0] === "VEVENT") {
            this.expect("VEVENT", input);
    		var rdv = this.creerRdv(input); //creer un objet rendez-vous a partir d'un event
    		this.expect("END", input);
            this.expect("VEVENT", input);
    		this.planning.addRdv(rdv); //ajoute l'objet rendez vous dans le planning
    		this.vEvent(input); //relance la fonction pour avoir le rendez-vous suivant
    		return true;
        } else {
            var baliseInconnue = input[0]; //On ignore les balises BEGIN:X où X est inconnu
            this.next(input);
            while(input[0] != "END" || input[1] != baliseInconnue) {
                this.next(input);
                this.next(input);
            }
            this.next(input);
            this.next(input);
            return this.vEvent(input);
        }
	} else {
		return false;
	}
}

/*body est une fonction qui permet de créer le rendezvous*/
IcalParser.prototype.creerRdv = function(input) {
    var str = {
        summary: null,
        location: null,
        dtstart: null,
        dtend: null
    };

    while(input[0] !== "END") { //On parcourt tout le VEVENT
        this.dataRdv(input, str);  //trie les données du rendez-vous
    }


    if(!str.summary || !str.location || !str.dtstart || !str.dtend) {
        this.err("Manque une information pour un rendez-vous.", input)
    }

    var summaryTableau = str.summary.split(/ *(\(|\)) */);

    var start_date = new Date(
        parseInt(str.dtstart.substr(0, 4)),
        parseInt(str.dtstart.substr(4, 2)) - 1,
        parseInt(str.dtstart.substr(6, 2)),
        parseInt(str.dtstart.substr(9, 2)),
        parseInt(str.dtstart.substr(11, 2)),
        parseInt(str.dtstart.substr(13, 2))
    );

    var end_date = new Date(
        parseInt(str.dtend.substr(0, 4)),
        parseInt(str.dtend.substr(4, 2)) - 1,
        parseInt(str.dtend.substr(6, 2)),
        parseInt(str.dtend.substr(9, 2)),
        parseInt(str.dtend.substr(11, 2)),
        parseInt(str.dtend.substr(13, 2))
    );

    return new rdv.RendezVous(summaryTableau[0], str.location, start_date, (end_date.getTime() - start_date.getTime())/(60*1000), summaryTableau[2]);
}

/*Permet de placer les informations en fonction des symboles suivants (SUMMARY, LOCATION, DTSTART, DTEND)*/
IcalParser.prototype.dataRdv = function(input, str) {
    if(!this.isKnown(input)) {
        this.next(input);
        this.next(input);
    } else if(this.check("SUMMARY", input)) {
        //Lignes SUMMARY:nom de l'intervention (intervenant)
        str.summary = this.summary(input);
    } else if(this.check("LOCATION", input)) {
        //Lignes LOCATION:lieu du rdv
        str.location = this.location(input);
    } else if(this.check("DTSTART", input)) {
        //Lignes DTSTART:jour et heure de début
        str.dtstart = this.dtstart(input);
    } else if(this.check("DTEND", input)) {
        //Lignes DTEND:jour et heure de fin
        str.dtend = this.dtend(input);
    } else {
        //Une ligne inconnue
        this.next(input);
        this.next(input);
    }
}

/**Permet de recuperer le titre du rendez vous*/
IcalParser.prototype.summary = function(input){
	this.expect("SUMMARY", input)
	var curS = this.next(input);
	return curS;
}

/**Permet de recuperer le titre du rendez vous*/
IcalParser.prototype.location = function(input){
	this.expect("LOCATION", input)
	var curS = this.next(input);
	return curS;
}

/**Permet de recuperer l'heure de départ du rendez vous*/
IcalParser.prototype.dtstart = function(input){
	this.expect("DTSTART", input)
	var curS = this.next(input);
	if(matched = curS.match(/\d\d\d\d\d\d\d\dT\d\d\d\d\d\d(|Z)+/i)){
		return matched[0];
	}else{
		this.err("Date de début invalide", input);
	}
}

/**Permet de recuperer l'heure de fin du rendez vous*/
IcalParser.prototype.dtend = function(input){
	this.expect("DTEND", input)
	var curS = this.next(input);
	if(matched = curS.match(/\d\d\d\d\d\d\d\dT\d\d\d\d\d\d(|Z)+/i)){
		return matched[0];
	}else{
		this.err("Date de fin invalide", input);
	}
}

//exports.parser_ical = parser_ical;
exports.IcalParser = IcalParser;
