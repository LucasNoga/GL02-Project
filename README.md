# README - Yadom - GG IZI - Projet GL02 - livrable 2 - A16

# 1)Description :
Le groupe "Hello World" nous a proposé de réaliser un projet qui lui a été demander de spécifier par l'entreprise Yadom. 
Celle-ci a pour but d'aider les personnes âgées de la ville de Yers en coordonnant les divers interventions que celles-ci peuvent recevoir. 
Cependant, ils ont de plus de mal à gérer leur logiciel avec le nombres d'emplois du temps qu'ils gèrent, autant pour
les personnes âgées que pour les différents intervenants. Notre mission consiste donc à implementer 
le cahier des charges qui nous a été proposé afin d'améliorer le logiciel PlanInfo de l'équipe de Yadom.

# 2)Explication de l'arborescence
main.js : programme principale
client.js :
parser_ical.js :
planning.js :
rdv.js :
serializer_ical.js :
aide.js :
files/ : répertoire qui contient des fichiers de types .csv et .ics pour pouvoir tester nos fonctionnalités


# 4)Installation:
    Assurez vous d'avoir nodejs d'installer sur votre ordinateur.
Pour lancer le programme, placez vous dans le dossier avec votre terminal.
Pour executer le programme taper : node main.js [commande] [arg1] [arg2]
[arg*] correspond en géneral au chemin relatifs des fichiers .ics et .csv qui sont a traités

# 5)Notice d'utilisation
node main.js pour accéder a l'interface utilisateur en command line
node parser_ical.js pour avoir en sortie un Planning du fichier iCalendar (.ics)
node parser_planinfo.js pour avoir en sortie un Planning du fichier planInfo (csv)

# 6)Liste des commandes


----------------------
Remarques : Le développement de cette solution a tenté de suivre dans la mesure du possible le cahier des charges définissant ce projet.
Certaines fonctions ne répondront donc peut-être pas aux attentes, ceci étant dû au manque de clarté dont pouvait faire preuve, parfois, le cahier des charges proposé.

Projet réalisé par :
Benjelloun Adam
Hurtaud Cesar
Zhang Yi
Noga Lucas
