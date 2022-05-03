// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDFom7TB4BeQWE84hWSZ7ZPYiog7ZqmLmE',
  authDomain: 'house-marketplace-8972b.firebaseapp.com',
  projectId: 'house-marketplace-8972b',
  storageBucket: 'house-marketplace-8972b.appspot.com',
  messagingSenderId: '39697870559',
  appId: '1:39697870559:web:357960749d9ba286e5836a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export const db = getFirestore();
