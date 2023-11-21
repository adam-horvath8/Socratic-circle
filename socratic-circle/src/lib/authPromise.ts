import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const authPromise = new Promise((resolve) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      resolve(user);
      unsubscribe();
    }
  });
});
