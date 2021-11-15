import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as crypto from "crypto";

admin.initializeApp();

const db = admin.firestore();

/**
 * Example function for development reference.
 * res.json() to send back JSON data.
 * res.send() if you want to return plain html inside a string.
 * res.status(200).json() if you want to send a
 * status code (change 200 to any code you want).
 * Look up documentation on Express endpoints for more info.
 *
 * To test your functions in an emulator, run
 * `npm run build` in the functions directory (to compile ts code)
 * and `firebase emulators:start` in the gashapon directory.
 *
 * Alternatively: `npm run func` in the gashapon directory.
 */
export const helloWorld = functions.https.onRequest(async (req, res) => {
  res.json({hello: "World!"});
});


export const getExample = functions.https.onRequest(async (req, res) => {
  db.doc("/ticket-info/shopname").get()
      .then((snapshot) => {
        const data = snapshot.data();
        res.send(data);
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send(error);
      });
});


export const generateTickets = functions.https.onCall(async (data, context) => {
  // Data
  const email = data.email;
  const memo = data.memo;
  const amount = data.amount;

  // Check if user is authenticated
  if (!context.auth) {
    // Throw an error if not
    throw new functions.https.HttpsError("unauthenticated",
        "The function must be called " +
      "while authenticated.");
  }

  // Check the amount variable is within range
  if (amount > 10 || amount < 1) {
    throw new functions.https.HttpsError("out-of-range",
        "A minimum of 1 and a maximum of 10 tickets " +
      "can be generated at a time.");
  }

  // Grab user info (id and shop tag)
  const uid = context.auth.uid;
  const shopTag = await db.doc(`/users/${uid}`).get()
      .then((snapshot) => {
        const data = snapshot.data();
        return data!.shopTag as string;
      })
      .catch((error) => {
        console.log(error);
        throw new functions.https.HttpsError("unknown", error);
      });

  // Generate ticket data
  const tickets : any = {};
  const timestamp = await admin.firestore.FieldValue.serverTimestamp();
  for (let i = 0; i < amount; i++) {
    // Generate a unique code
    let suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    let code = `${shopTag}-${suffix}`;
    let ticketPath = `/ticket-info/${code}`;
    while ((await db.doc(ticketPath).get()).exists) { // avoids duplicates
      suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
      code = `${shopTag}-${suffix}`;
      ticketPath = `/ticket-info/${code}`;
    }

    // Create the JSON object
    const ticketData = {
      createdAt: timestamp,
      email,
      memo,
      orderID: null,
      prizeID: null,
      redeemed: false,
      shipped: false,
    };

    // Write to firestore
    db.collection("ticket-info").doc(code).set(ticketData)
        .catch((error) => {
          console.log(error);
          throw new functions.https.HttpsError("unknown", error);
        });

    // Append to list
    tickets[code] = ticketData;
  }

  return tickets;
});
