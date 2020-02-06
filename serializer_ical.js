var serialiserDate = function(date) {
    var dateEnCaractere = "";
    dateEnCaractere += date.getFullYear();
    dateEnCaractere += ("0" + (date.getMonth()+1)).slice(-2); //Permet d'avoir toujours un nombre avec deux chiffres
    dateEnCaractere += ("0" + date.getDate()).slice(-2);
    dateEnCaractere += "T";
    dateEnCaractere += ("0" + date.getHours()).slice(-2);
    dateEnCaractere += ("0" + date.getMinutes()).slice(-2);
    dateEnCaractere += ("0" + date.getSeconds()).slice(-2);

    return dateEnCaractere;
}

/**
 * Enregistre un Planning dans un fichier icalendar sous la forme
 * BEGIN:VCALENDAR
 * BEGIN:VEVENT
 * SUMMARY:titre rendez-vous (intervenant du rendez-vous)
 * LOCATION:lieu rendez-vous
 * DTSTART:date et heure de début
 * DTEND:date et heure de fin
 * END:VEVENT
 * END:VCALENDAR
 * Note : SUMMARY contient deux informations car le format icalendar ne permet pas
 * de stocker la personne responsable d'un événement sans adresse e-mail.
 */
var serialiserPlanningEnIcal = function(planning, chemin_fichier_ical) {
    var fs = require('fs');
    var stream = fs.createWriteStream(chemin_fichier_ical);
    stream.once('open', function(fd) {
        stream.write("BEGIN:VCALENDAR\n");
        stream.write("VERSION:2.0\n");
        stream.write("PRODID:-//UTT/GL02/A15/UTTIFY\n")
        for(var i = 0; i < planning.listeRdv.length; i++) { //tant qu'il ya des rendezvous dans le plnning
            var rdv = planning.getRdv(i);
            stream.write("BEGIN:VEVENT\n");
            stream.write("SUMMARY:" + rdv.titre + " (" + rdv.intervenant + ")\n");
            stream.write("LOCATION:" + rdv.lieu + "\n");
            stream.write("DTSTART:"+serialiserDate(rdv.getDebut()) + "\n");
            stream.write("DTEND:"+serialiserDate(rdv.getFin()) + "\n");
            stream.write("END:VEVENT\n");
        }
        stream.write("END:VCALENDAR\n");
        stream.end();
    });
};


var pl = require('./planning');
var rdv = require('./rdv');
/*creer un planing pour le test*/
var planning = new pl.Planning();


var rdv1 = new rdv.RendezVous("titre1", "intervenant1", new Date(2016, 1, 04, 00, 30, 00, 000), 30, "lieu1");
var rdv2 = new rdv.RendezVous("titre2", "intervenant2", new Date(2017, 5, 24, 05, 30, 00, 000), 30, "lieu2");
planning.addRdv(rdv1);
planning.addRdv(rdv2);
//console.log(planning)
serialiserPlanningEnIcal(planning, './files/iCalSeriliazer.ics');

exports.serialiserPlanningEnIcal = serialiserPlanningEnIcal;
