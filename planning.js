var rdv = require("./rdv");

/**
 * @constructor
 * Crée un objet Planning à qui représente la liste des rendez-vous d'un fichier ICAL avec le nom de l'intervenant, la date, l'heure de début, la durée et le lieu.
 */

var Planning = function() {
    this.listeRdv = [];
};

/*Permet d'ajouter des rendez vous dans el planning
* @param rdv */
Planning.prototype.addRdv = function(rdv) {
    this.listeRdv.push(rdv);
};

Planning.prototype.getRdv = function(i) {
    return this.listeRdv[i];
};

var getUnionDeuxPlannings = function(p1, p2) {
    var planningUnion = new Planning();
    //On ajoute tous les rdv de p1 puis ceux de p2 dans planningUnion
    for(var i = 0; i < p1.listeRdv.length; i++) {
	var unionRdv = p1.getRdv(i);
        //On ajoute le RendezVous en créant une nouvelle instance (si on l'ajoute
        //directement, l'objet n'est pas copié mais dans les deux Plannings à la
        //fois).
	planningUnion.addRdv(new rdv.RendezVous(
            unionRdv.titre,
            unionRdv.intervenant,
            unionRdv.date_heure,
            unionRdv.duree,
            unionRdv.lieu
        ));
	}
	for(var j = 0; j < p2.listeRdv.length; j++) {
        var unionRdv = p2.getRdv(j);
        planningUnion.addRdv(new rdv.RendezVous(
            unionRdv.titre,
            unionRdv.intervenant,
            unionRdv.date_heure,
            unionRdv.duree,
            unionRdv.lieu
        ));
    }
	return planningUnion;
}

var getUnionPlannings = function(p) {
    var planningUnion = new Planning();
    for(var i = 0; i < p.length; i++) {
		planningUnion=getUnionDeuxPlannings(p[i], planningUnion);
	}
    return planningUnion;
}

/**
 * @method getIntersectionDeuxPlannings
 * Retourne un planning contenant les intersections entre les plannings p1 et p2.
 * @param p1 {Planning} le premier planning
 * @param p2 {Planning} le second planning
 * @return {Planning} un planning contenant les intersections entre p1 et p2
 * @see getIntersectionPlannings pour avoir une fonction qui supporte plus de deux plannings.
 */
var getIntersectionDeuxPlannings = function(p1, p2) {
    var planningIntersection = new Planning();

    //On itère sur tous les rendez-vous de chaques plannings pour trouver les
    //intersections
    for(var i = 0; i < p1.listeRdv.length; i++) {
        for(var j = 0; j < p2.listeRdv.length; j++) {

            var intersectionRdv = p1.getRdv(i).intersectionMemeLieuOuIntervenant(p2.getRdv(j));
            if(intersectionRdv) {
                //Il y a bien une intersection, on l'ajoute
                planningIntersection.addRdv(intersectionRdv);
            }
        }
    }
    return planningIntersection;
}

/**
 * @method getIntersectionDeuxPlannings
 * Retourne un planning contenant les intersections entre les plannings contenus dans p deux à deux.
 * @param p {Array of Planning} un tableau de plannings
 * @return {Planning} un planning contenant les intersections entre tous les plannings deux à deux.
 */
var getIntersectionPlannings = function(p) {
    //On parcourt tous les plannings deux à deux en faisant en sorte de ne pas parcourir deux
    //fois le même couple de planning (et de ne pas traiter un couple formé d'un même planning).
    var planningIntersection = new Planning();
    for(var i = 0; i < p.length; i++) {
        for(var j = i + 1; j < p.length; j++) {
            var planningIntersectionDeux = getIntersectionDeuxPlannings(p[i], p[j]);
            planningIntersection=getUnionDeuxPlannings(planningIntersection, planningIntersectionDeux);
        }
    }
    return planningIntersection;
}


Planning.prototype.ecrireRapportIntervention= function(chemin_fic_csv){
    var cpt_heure={};
    var cpt_intervention={};
    for(var i=0; i<this.listeRdv.length;i++){
        var nom=this.getRdv(i).intervenant;

        if (cpt_intervention[nom] == undefined) {
            cpt_intervention[nom] = 0;
        }
        cpt_intervention[nom]++;

        if (cpt_heure[nom] == undefined) {
            cpt_heure[nom] = 0;
        }
        cpt_heure[nom] += this.getRdv(i).duree / 60;
    }
    var fs = require('fs');
    var stream = fs.createWriteStream(chemin_fic_csv);
    stream.once('open', function(fd) {
        stream.write('nom;nombre d\'intervention;nombre d\'heure\n');
        for(var nom in cpt_heure){
            stream.write(nom + ';' + cpt_intervention[nom] + ';' + cpt_heure[nom] + '\n');
        }
    });

}

exports.Planning = Planning;
exports.getUnionPlannings = getUnionPlannings;
exports.getIntersectionPlannings= getIntersectionPlannings;
