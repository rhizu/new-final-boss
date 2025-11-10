import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBaVVx8yBCMP9ciJm2MfF9ZQahOCBF9jJA",
  authDomain: "asl-sign-language-recognition.firebaseapp.com",
  projectId: "asl-sign-language-recognition",
  storageBucket: "asl-sign-language-recognition.firebasestorage.app",
  messagingSenderId: "261699104475",
  appId: "1:261699104475:web:9b2fc40c4ae2a49cace6fe",
  measurementId: "G-PYQVKZB83P"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db};
