// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { setUserLoggedIn, setUserLoggedOut } from './reducer/userSlice';
import { store } from './store';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcyetHDg06enlSz21Ekp0wy8rKEaeQWK8",
  authDomain: "seoul-spice.firebaseapp.com",
  projectId: "seoul-spice",
  storageBucket: "seoul-spice.appspot.com",
  messagingSenderId: "361252190629",
  appId: "1:361252190629:web:9cabbaaeecce3f131e504c",
  measurementId: "G-8CML9DKDBZ"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();



provider.setCustomParameters({
  prompt: "select_account"
});

export const db = getFirestore(app);

export const auth = getAuth();

export let authLoaded = false;

export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const setAuthListener = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      store.dispatch(setUserLoggedIn());
      // ...
    } else {
      // User is signed out
      // ...
      store.dispatch(setUserLoggedOut());
    }
    authLoaded = true;
  });
}

export const checkUserLogin = () => {
  return new Promise((resolve, reject) => {
    auth.authStateReady().then((user: any) => {

      resolve(auth.currentUser);

    }).catch(error => {
      console.debug('Error in initial authentication check : ', error)
      reject(error);
    });
  })
}

export const getUserId = () => {
  return auth.currentUser?.uid;
}

export const getUserName = () => {
  return auth.currentUser?.displayName;
}

export const logout = () => {
  return new Promise((resolve, reject) => {
    auth.signOut().then(() => {
      resolve(true);
    }).catch((error) => {
      reject(error);
    });
  });
}


