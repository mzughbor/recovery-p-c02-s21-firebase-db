// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { 
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCM_vFI3EFPzTqKeoTrUEIzMCs1YQZe9Iw",
  authDomain: "app-fire-mzug.firebaseapp.com",
  projectId: "app-fire-mzug",
  storageBucket: "app-fire-mzug.firebasestorage.app",
  messagingSenderId: "442805586029",
  appId: "1:442805586029:web:e8f98b4201e58a29965764",
  measurementId: "G-GPK49Y4JTZ",
};

// Initialize Firebase
//const app =
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

// collection ref
const collectionRef = collection(db, "firebase");

//query
const q = query(collectionRef, orderBy("title", "asc"));

// real time collection data
onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding docs
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addDoc(collectionRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

//get single doc

const docRef = doc(db, "firebase", "VrOOqpaAO4HwHjxGiauX");

// getDoc(docRef).then((doc) => {
//   if (doc.exists()) {
//     console.log(doc.data(), doc.id);
//   } else {
//     console.log("No such document!");
//   }
// });

onSnapshot(docRef, (doc) => { 
    console.log("get single doc >>",doc.data());
  }
);

// update a document new ideas ...
// append the docs to the select input
const selectInput = document.querySelector(".documentSelect");
const querySnapshot = await getDocs(collection(db, "firebase"));
querySnapshot.forEach((doc) => {
  const option = document.createElement("option");
  option.text = doc.id;
  option.value = doc.id;
  selectInput.appendChild(option);  
});

// Fetch and display selected document's data
const displayDiv = document.getElementById("documentDisplay");

// Global variable for selected document ID
let selectedDocId = null;

selectInput.addEventListener("change", async () => {
  selectedDocId = selectInput.value;

  if (selectedDocId) {
    const docRef = doc(db, "firebase", selectedDocId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      displayDiv.textContent = JSON.stringify(docSnap.data(), null, 2);
    } else {
      displayDiv.textContent = "No such document!";
    }
  }
});

// update a document - 1) the title
const updateBookForm = document.querySelector(".update-title");
updateBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (selectedDocId) {
    const docRef = doc(db, "firebase", selectedDocId);
    await updateDoc(docRef, {
      title: updateBookForm.newTitle.value,
    });
    updateBookForm.reset();
    console.log(`Document with ID ${selectedDocId} updated successfully.`);
  } else {
    console.error("No document selected for update.");
  }
});

// update a document 2 - the author
const updateBookFormAuthor = document.querySelector(".update-author");
updateBookFormAuthor.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (selectedDocId) {
    const docRef = doc(db, "firebase", selectedDocId);
    await updateDoc(docRef, {
      author: updateBookFormAuthor.newAuthor.value,
    });
    updateBookFormAuthor.reset();
    console.log(`Document with ID ${selectedDocId} updated successfully.`);
  } else {
    console.error("No document selected for update.");
  }
});




// delete a document
// ++ new ideas ...
// append the docs to the select input
const selectInputDel = document.querySelector(".documentSelectDelete");
const querySnapshotDel = await getDocs(collection(db, "firebase"));
querySnapshotDel.forEach((doc) => {
  const option = document.createElement("option");
  option.text = doc.id;
  option.value = doc.id;
  selectInputDel.appendChild(option);  
});

// Fetch and display selected document's data
const displayDivDel = document.getElementById("documentDisplayDelete");

selectInputDel.addEventListener("change", async () => {
  let selectedDocIdDel = selectInputDel.value;

  if (selectedDocIdDel) {
    const docRef = doc(db, "firebase", selectedDocIdDel);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      displayDivDel.textContent = JSON.stringify(docSnap.data(), null, 2);
    } else {
      displayDivDel.textContent = "No such document!";
    }
  }
});

// deleting docs + applying new ideas...
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let selectedDocIdDel = selectInputDel.value;
  if (selectedDocIdDel) {
    const docRef = doc(db, "firebase", selectedDocIdDel);
    await deleteDoc(docRef);
    deleteBookForm.reset();
    console.log(`Document with ID ${selectedDocIdDel} deleted successfully.`);
  } else {
    console.error("No document selected for deletion.");
  }
});

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user created:', cred.user)
      signupForm.reset()
    })
    .catch(err => {
      console.log(err.message)
    })
})

// logout users
const logout = document.querySelector('.logout')
logout.addEventListener('click', (e) => {
  e.preventDefault()
  auth.signOut().then(() => {
    console.log('user signed out')
  })
})

//  logging users in
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword (auth, email, password)
  .then(cred => {
    console.log('user logged in:', cred.user)
    loginForm.reset()
  }).catch(err => {
    console.log(err.message)
  })  
});