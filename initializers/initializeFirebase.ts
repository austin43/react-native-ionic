import { FirebaseApp, initializeApp } from "firebase/app";

export let firebaseApp: FirebaseApp | undefined;

export const initializeFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyA54_o_8RJtnyx6DJOCDgu9dD-jCCcfrjY",
    authDomain: "timesports-dev.firebaseapp.com",
    databaseURL: "https://timesports-dev.firebaseio.com",
    projectId: "timesports-dev",
    storageBucket: "timesports-dev.appspot.com",
    messagingSenderId: "393853262953",
    appId: "1:393853262953:web:12dd873a09abb0f63816f8",
  };

  firebaseApp = initializeApp(firebaseConfig);
};
