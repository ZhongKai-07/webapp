import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // config
};

export function initFirebase() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
}

const app = initFirebase();
const db = getFirestore(app);

export { db };
