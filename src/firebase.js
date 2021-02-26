import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
// import { ARTICLES, ARTICLE_DETAIL, CATEGORIES , APP_PAGES } from "./api/collections";

const envConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// console.log({ envConfig });

// ignoring to use firebase config
// eslint-disable-next-line no-undef
const indexHtmlConfig = __indexHtmlFirebaseConfig;

const config = indexHtmlConfig || envConfig;

const firebaseApp = firebase.initializeApp(config);

export const firebaseAuth = firebaseApp.auth();
export const firebaseGoogleSignInProvider = new firebase.auth.GoogleAuthProvider();
export const firebaseFacebookSignInProvider = new firebase.auth.FacebookAuthProvider();

export const firestore = firebaseApp.firestore();
export const firebaseStorage = firebaseApp.storage();

export default firebaseApp;

// const firebaseConfig = {
//   apiKey: "AIzaSyCG6bgXx7OY6Ih40J5ca4stBGJIlsUNQPQ",
//   authDomain: "mbocky-d14fb.firebaseapp.com",
//   projectId: "mbocky-d14fb",
//   storageBucket: "mbocky-d14fb.appspot.com",
//   messagingSenderId: "878720684225",
//   appId: "1:878720684225:web:9f609b075fd6fa65738440",
//   measurementId: "G-2Y62RX9T6M"
// };

// const firebaseApp23 = firebase.initializeApp(firebaseConfig, "mine");

// const firestore23 = firebaseApp23.firestore();

// firestore
//   .collection(APP_PAGES)
//   // .orderBy("order")
//   .get()
//   .then((querySnapshot) => {
//     const list = querySnapshot.docs.map((doc) => {
//       const value = doc.data();

//       console.log({id : doc.id,value})
//       firestore23.collection(APP_PAGES).doc(doc.id).set(value);

//       return { id: doc.id, ...value };
//     });

//     return list;
//   });
