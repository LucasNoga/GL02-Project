/*Fichier qui permet de lancer les tests*/


var testRunner = require("qunit");
var path = require("path");

testRunner.run({
    code:  path.join(__dirname, "../rdv.js"),
    tests: path.join(__dirname, "./test2.js")
});