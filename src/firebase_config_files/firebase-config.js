// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZHP4QGn01AWEfD4kdtWgCKbmzXiMpWdA",

  authDomain: "todo-29c0d.firebaseapp.com",

  projectId: "todo-29c0d",

  storageBucket: "todo-29c0d.appspot.com",

  messagingSenderId: "78402583426",

  appId: "1:78402583426:web:670ee4168824147e322d9b",
};

const getFirebaseConfig = () => {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return firebaseConfig;
  }
};

export { getFirebaseConfig };
