import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  doc,
  setDoc,
} from "firebase/firestore";
import getFirebaseConfig from "./firebase-config";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

/* ----- Authentication ------ */

const app = initializeApp(getFirebaseConfig());

const auth = getAuth();

const provider = new GoogleAuthProvider();

const getUser = async () => {
  const user = await auth.currentUser;
  console.log("Hello", user.displayName);
};

const getUserName = () => {
  return auth.currentUser.displayName;
};

const isUserSignedIn = () => {
  return !!auth().currentUser;
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

const colRef = collection(db, "userData");

const getQuerySnapshot = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.username}`);
  });
};


const addNewUser = async (obj) => {
  const { uid } = await auth.currentUser;

  return setDoc(
    doc(db, "userData", uid),
    {
      tasks: ["a task"],
      projects: ["a project"],
    },
    { merge: true }
  );
};

export { userSignIn, userSignOut, getQuerySnapshot, getUser, addNewUser };
