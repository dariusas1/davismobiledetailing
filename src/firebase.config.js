import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCrgkDMEAkEwzdRpt42slEQVPMO3mFqysY",
    authDomain: "davis-e2ce9.firebaseapp.com",
    projectId: "davis-e2ce9",
    storageBucket: "davis-e2ce9.appspot.com",
    messagingSenderId: "521729027677",
    appId: "1:521729027677:web:790d672ee39a58ca15e7b4"
  };

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };