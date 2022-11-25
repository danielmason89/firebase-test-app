import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDy45yIGeqs89IW6T9VWEQa96hku_qfBpg",
  authDomain: "fir-test-app-a338c.firebaseapp.com",
  projectId: "fir-test-app-a338c",
  storageBucket: "fir-test-app-a338c.appspot.com",
  messagingSenderId: "542511881170",
  appId: "1:542511881170:web:17546d743b1592ad29060b",
  measurementId: "G-00FHGSL5ET",
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

const colRef = collection(db, "books");

const q = query(colRef, orderBy("createdAt"));

// getDocs(colRef)
//   .then((snapshot) => {
//     let books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({
//         ...doc.data(),
//         id: doc.id,
//       });
//       console.log(books);
//     });
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  console.log(books);
});

const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const docRef = doc(db, "books", deleteBookForm.id.value);
  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

const docRef = doc(db, "books", "5fi6pcrcmgn5dRaqKSEH");

// getDoc(docRef).then((doc) => {});

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

const updateBookForm = document.querySelector(".update");
updateBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateBookForm.id.value);

  updateDoc(docRef, {
    title: "updated title",
  }).then(() => {
    updateBookForm.reset();
  });
});

const signUpForm = document.querySelector(".signup");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signUpForm.email.value;
  const password = signUpForm.password.value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //   console.log("user created", cred.user);
      signUpForm.reset();
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const logoutButton = document.querySelector(".logout");
const loginForm = document.querySelector(".login");

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      //   console.log("the user signed out.");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      //   console.log("user logged in:", cred.user);
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user);
});

const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
  console.log("unsubscribing");
  unsubCol();
  unsubDoc();
  unsubAuth();
});
