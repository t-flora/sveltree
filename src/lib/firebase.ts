import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { derived, writable } from 'svelte/store';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEk-atmGRQhiiC-fGXQ6gKon4mSKJfoNY",
  authDomain: "sveltree.firebaseapp.com",
  projectId: "sveltree",
  storageBucket: "sveltree.appspot.com",
  messagingSenderId: "1069739125701",
  appId: "1:1069739125701:web:8b9270b03b3b0518d7f9ac",
  measurementId: "G-K0YJBJQ9MW"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();

function userStore() {
    // have an authentication state stored in a Svelte store
    let unsubscribe: () => void;

    if (!auth || !globalThis.window) {
        console.warn("not authenticated or not in browser window");
        const { subscribe } = writable<User|null>(null);
        return {
            subscribe,
        }
    }

    const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
        const subscribe = onAuthStateChanged(auth, (user) => {
            set(user);
        })
        return () => unsubscribe();
    })

    return {
        subscribe,
    }
}

export const user = userStore();

/**
 * Creates a store with realtime document data
 * @param {any} path:string
 * @returns {any}
 */
export function docStore<T>(
    path: string,
) {
    let unsubscribe: () => void;

    const docRef = doc(db, path);

    const { subscribe } = writable<T | null>(null, (set) => {
        unsubscribe = onSnapshot(docRef, (snapshot) => {
            set((snapshot.data() as T) ?? null);
        });
        return () => unsubscribe();
    });

    return {
        subscribe,
        ref: docRef,
        id: docRef.id,
    };
}

interface UserData {
    username: string,
    bio: string,
    photoURL: string,
    links: any[]
}

export const userData = derived(user, ($user, set) => {
    // Derived store is used to get both user data and authentication state at once
    if ($user) {
        return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
        set(null);
    }
})