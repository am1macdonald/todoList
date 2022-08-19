import { initializeApp } from "firebase/app";
import getFirebaseConfig from "./firebase-config";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";

const app = initializeApp(getFirebaseConfig());

const auth = getAuth();

const provider = new GoogleAuthProvider();

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

export { userSignIn, userSignOut, auth };
