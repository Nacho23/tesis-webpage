"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.createUser = functions.https.onCall((data, context) => {
    let result;
    return admin.auth().createUser({
        email: data.email,
        password: data.pass,
        disabled: false
    })
        .then(userRecord => {
        result = {
            uid: userRecord.uid,
            email: userRecord.email
        };
        return result;
    })
        .catch(function (error) {
        result = {
            error: error
        };
        return result;
    });
});
exports.getUserByEmail = functions.https.onCall((data, context) => {
    let result;
    return admin.auth().getUserByEmail(data.email)
        .then(userRecord => {
        result = {
            uid: userRecord.uid
        };
        return result;
    })
        .catch(function (error) {
        result = {
            error: error
        };
    });
});
exports.deleteUser = functions.https.onCall((data, context) => {
    let result;
    return admin.auth().deleteUser(data.uid)
        .then(userRecord => {
        result = {
            uid: userRecord
        };
        return result;
    })
        .catch(function (error) {
        result = {
            error: error
        };
    });
});
//# sourceMappingURL=index.js.map