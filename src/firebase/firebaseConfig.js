// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAu-NbK-PXd4VDy8ykHwJ6Kzw9Uv_JKspU',
    authDomain: 'tiktok-77077.firebaseapp.com',
    databaseURL: 'https://tiktok-77077-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'tiktok-77077',
    storageBucket: 'tiktok-77077.appspot.com',
    messagingSenderId: '391457477849',
    appId: '1:391457477849:web:f91ff60f310a6a8d301ac8',
    measurementId: 'G-LNWQJ4CJQD',
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase);

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);
connectAuthEmulator(auth, process.env.REACT_APP_FIREBASE_AUTH_EMULATOR_HOST);
connectFirestoreEmulator(db, '127.0.0.1', 8080);
export { auth, db };
export default appFirebase;
// console.log(app);
