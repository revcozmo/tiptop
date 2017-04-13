var functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// Checks wehter username is already taken when new entry is edited in database/requiredUsernames
  exports.checkNameRequirement = functions.database.ref("/requiredUsernames")
    .onWrite(event => {
      // Data to check
        const req = event.data.val();

      // Get list of all usernames
        var db = admin.database();
        var ref = db.ref("/users/names");
        ref.on("value", function(snapshot) {
          console.log(snapshot.val());
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
    });
