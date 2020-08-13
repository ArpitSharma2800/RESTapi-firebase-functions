import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
let serviceAccount = require("../src/key.json");

admin.initializeApp({credential: admin.credential.cert(serviceAccount), databaseURL: "https://functions-801a7.firebaseio.com"});
export const helloWorld = functions.https.onRequest((request, response) => {
    const promise = admin.firestore().doc('/cities-weather/boston').get()
    const p2 = promise.then(snap => {
        const data = snap.data()
        response.send(data)
    })
    p2.catch(e => {
        console.log(e)
        response.status(500).send(e)
    })
});
