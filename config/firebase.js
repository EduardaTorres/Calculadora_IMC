// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCtE2vxK7c_3O7_k2ngmRrPpoCFjixcuoQ",
    authDomain: "appfirebase-5e018.firebaseapp.com",
    projectId: "appfirebase-5e018",
    storageBucket: "appfirebase-5e018.appspot.com",
    messagingSenderId: "314219636690",
    appId: "1:314219636690:web:007158ff597541ac3a8a0b",
    measurementId: "G-C00HLYFJ9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);