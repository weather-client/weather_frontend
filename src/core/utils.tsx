import { FirebaseApp, FirebaseOptions, initializeApp } from "@firebase/app";


export function getFirebaseApp(): FirebaseApp{
    try {
        const firebaseConfig = require('../firebase-config.json');
        return initializeApp(firebaseConfig as FirebaseOptions);
    }
    catch (e) {
        console.log('No firebase config found');
    }
    return initializeApp();
}

export const firebaseConfig = {
    apiKey: "AIzaSyBSr9C1M9a7UbyWukJk7MtvjaXiQdg59MQ",
    authDomain: "weather-station-elka.firebaseapp.com",
    databaseURL:
      "https://weather-station-elka-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "weather-station-elka",
    storageBucket: "weather-station-elka.appspot.com",
    messagingSenderId: "306368859932",
    appId: "1:306368859932:web:b66e2bbfd1829a70ff74d9",
  };