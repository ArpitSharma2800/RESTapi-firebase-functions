import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";
let serviceAccount = require("../src/key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://functions-801a7.firebaseio.com",
});
const app = express();
app.use(cors({ origin: true }));

app.get("/", (req, res) => {
  return res.status(200).send("working!!!");
});

//create route
app.post("/api/create", (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };
  admin
    .firestore()
    .collection("products")
    .doc("/" + req.body.id + "/")
    .create(data)
    .then((snap) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});
app.post("/api/create/realtime", (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };
  admin
    .database()
    .ref("products")
    .child(req.body.id)
    .set(data)
    .then((snapshot) => {
      res.status(200).send("done");
    });
});
//read route firebase realtime database
app.get("/api/create/realtime", (req, res) => {
  admin
    .database()
    .ref("products")
    .once("value")
    .then((snapshot) => {
      res.status(200).send(snapshot.val());
    });
});

//read route
app.get("/api/read/:id", (req, res) => {
  admin
    .firestore()
    .collection("products")
    .doc(req.params.id)
    .get()
    .then((snap) => {
      res.status(200).send(snap.data());
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});

//read all
app.get("/api/read", (req, res) => {
  admin
    .firestore()
    .collection("products")
    .get()
    .then((querySnapshot) => {
      const tempDoc = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      res.status(200).send(tempDoc);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
      res.status(500).send(err);
    });
});

//update route
app.put("/api/update/:id", (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };
  admin
    .firestore()
    .collection("products")
    .doc(req.params.id)
    .update(data)
    .then((snap) => {
      res.status(200).send(data);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});

//delete route
app.delete("/api/delete/:id", (req, res) => {
  admin
    .firestore()
    .collection("products")
    .doc(req.params.id)
    .delete()
    .then((snap) => {
      res.status(200).send("successfully deleted");
    })
    .catch((e) => {
      console.log(e);
      res.status(500).send(e);
    });
});

export const apps = functions.https.onRequest(app);
