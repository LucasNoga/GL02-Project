/**exemple de test de qunit*/
var QUnit = require("qunitjs");

QUnit.extend(QUnit.assert, {
    notOk: function (result, message) {
        message = message || (!result ? "okay" : "failed, expected argument to be falsey, was: " +
        QUnit.dump.parse(result));
        QUnit.push(!result, result, false, message);
    },
});


QUnit.module("Objets RendezVous");

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});







//il faudra tester

/*les lectures de fichiers existant ou non*/


/*les lancements de commmandes bonne ou mauvaise*/