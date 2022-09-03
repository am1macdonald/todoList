import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import getFirebaseConfig from "./firebase-config";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
} from "firebase/auth";
import Project from "../classes/projectClass";
import Task from "../classes/taskClass";

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
  return auth.currentUser.uid;
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

const projectConverter = {
  toFirestore: (project) => {
    return {
      ...project,
    };
  },
  fromFirestore: (doc) => {
    const { title, description, dueDate, notes, tasks, identifier, complete } =
      doc.data();
    return new Project(
      title,
      description,
      dueDate,
      notes,
      tasks,
      identifier,
      complete
    );
  },
};

const taskConverter = {
  toFirestore: (task) => {
    return {
      ...task,
    };
  },
  fromFirestore: (doc) => {
    const {
      title,
      description,
      dueDate,
      priority,
      notes,
      checklist,
      identifier,
      complete,
    } = doc.data();
    return new Task(
      title,
      description,
      dueDate,
      priority,
      notes,
      checklist,
      identifier,
      complete
    );
  },
};

const addToDatabase = async (obj, collectionName, converter) => {
  const result = await addDoc(
    collection(db, `userData/${auth.currentUser.uid}/${collectionName}`),
    converter.toFirestore(obj)
  );
  console.log(result.id);
  return result.id;
};

const updateDocument = async (obj, collection, converter) => {
  const itemRef = doc(
    db,
    `userData/${auth.currentUser.uid}/${collection}`,
    obj.key
  );

  const result = await setDoc(itemRef, converter.toFirestore(obj));

  return result;
};

const getCollection = async (collectionName, converter) => {
  try {
    const map = {};
    const snap = await getDocs(
      collection(db, `userData/${auth.currentUser.uid}/${collectionName}`)
    );
    snap.forEach((doc) => {
      map[doc.id] = converter.fromFirestore(doc);
      // console.log(doc.id, " => ", doc.data());
    });
    return map;
  } catch (e) {
    console.error(e);
  }
};

const removeDocument = async (id, collection) => {
  const itemRef = doc(db, `userData/${auth.currentUser.uid}/${collection}`, id);
  console.log(getDoc(itemRef));
  try {
    const result = await deleteDoc(itemRef);
    return result;
  } catch (e) {
    console.error(e);
  }
};

const addNewUser = async (obj) => {
  const { uid } = await auth.currentUser;

  return setDoc(doc(db, "userData", uid), { merge: true });
};

export {
  userSignIn,
  userSignOut,
  getUser,
  addNewUser,
  addToDatabase,
  getCollection,
  removeDocument,
  projectConverter,
  taskConverter,
};
