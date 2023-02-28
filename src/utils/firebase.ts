// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs
} from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { firebaseConstants } from "./constants";

const {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
    MEASUREMENT_ID
} = firebaseConstants
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore();

// Collection Ref
const colRef = collection(db, 'books');

// Get Collection Data
let books: any[] = [];
const runSome = () => {
    getDocs(colRef)
        .then((snapshot: any) => {
            snapshot.docs.forEach((doc: any) => {
                books.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            console.log(books)
        })
        .catch(err => {
            console.log(err.message);
        })
}

// Initialize Analytics
const analytics = getAnalytics(app);

export {
    app,
    analytics,
    getFirestore,
    runSome,
    books
};