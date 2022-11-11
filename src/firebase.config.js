import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCLGsl4hsJcfX3zx3Vw1CU_BHZL7PlbGJ0",
    authDomain: "davis-8626f.firebaseapp.com",
    projectId: "davis-8626f",
    storageBucket: "davis-8626f.appspot.com",
    messagingSenderId: "255584166515",
    appId: "1:255584166515:web:dbad640faa8909e3c84006"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };