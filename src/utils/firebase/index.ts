// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    collection,
    getFirestore
} from 'firebase/firestore';
import { firebaseConstants } from "../constants";
import { 
    fetchBooks,
    addBook,
    deleteBook
} from "./books";

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
const booksColRef = collection(db, 'books');

export {
    db,
    booksColRef,
    /* BOOKS START */
    fetchBooks,
    addBook,
    deleteBook
    /* BOOKS END */
};