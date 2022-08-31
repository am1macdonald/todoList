import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
} from "firebase/firestore";
import getFirebaseConfig from "./firebase-config";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import Project from "../classes/projectClass";

/* ----- Authentication ------ */

const app = initializeApp(getFirebaseConfig());

const auth = getAuth();

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("hahaha");
  }
});

const provider = new GoogleAuthProvider();

const getUser = async () => {
  const user = await auth.currentUser;
  console.log("Hello", user.displayName);
};

const userIsSignedIn = () => {
  return !!auth.currentUser;
};

const userSignIn = async () => {
  const data = await signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });

  return data;
};

const userSignOut = async () => {
  await signOut(auth)
    .then(() => {
      console.log("signed out");
    })
    .catch((error) => {
      console.error(error);
    });
  return null;
};

/* ----- Database Manipulation ------ */

const db = getFirestore(app);

const fetchUserDocs = async () => {
  const { uid } = await auth.currentUser;

  const docRef = doc(db, "userData", uid);

  const docSnap = await getDoc(docRef);

  console.log(docSnap.data());

  return docSnap.data();
};

const projectConverter = {
  toFirestore: (project) => {
    return {
      ...project,
    };
  },
  fromFirestore: (snapshot, options) => {
    const { title, description, dueDate, notes, tasks, identifier, complete } =
      snapshot.data(options);
    return new Project({
      title,
      description,
      dueDate,
      notes,
      tasks,
      identifier,
      complete,
    });
  },
};

const addProjectToDatabase = async (obj) => {
  const result = await addDoc(
    collection(db, `userData/${auth.currentUser.uid}/projects`),
    projectConverter.toFirestore(obj)
  );
  console.log(result.id);
  return result.id;
};
const getProjectCollection = async () => {
  const ref = getDocs(db, `userData/${uid}/projects`);
};

// getDocs(colRef)
//   .then((snapshot) => {
//     const books = [];
//     snapshot.docs.forEach((doc) => {
//       books.push({ ...doc.data(), id: doc.id });
//     });
//     console.log(books);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const addNewUser = async (obj) => {
  const { uid } = await auth.currentUser;

  return setDoc(doc(db, "userData", uid), { merge: true });
};

export {
  userSignIn,
  userSignOut,
  userIsSignedIn,
  getUser,
  addNewUser,
  fetchUserDocs,
  addProjectToDatabase,
};
