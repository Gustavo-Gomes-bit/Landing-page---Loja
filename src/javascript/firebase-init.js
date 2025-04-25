import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
  collectionGroup,
  where,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";


// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCY5FczRqvDpxGaVUwes579kgcAQJEd4UY",
  authDomain: "fonte-artigo.firebaseapp.com",
  projectId: "fonte-artigo",
  storageBucket: "fonte-artigo.appspot.com",
  messagingSenderId: "449652212731",
  appId: "1:449652212731:web:8a3dc4ba54a6b60aeb415e",
};

// Inicializa Firebase
export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export { db, auth, provider };