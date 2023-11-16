import * as React from "react";
import { auth, db, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

//  types

export interface ILogInProps {}

export default function LogIn(props: ILogInProps) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const signInWithGoogle = async () => {
    const profilesCollectionRef = collection(db, "profiles");

    try {
      await signInWithPopup(auth, provider);

      const q = query(
        collection(db, "profiles"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        const profileData = {
          userId: auth.currentUser?.uid,
          firstName: "",
          lastName: "",
          about: "",
          degree: "",
          school: "",
          currentCity: "",
          homeTown: "",
          email: "",
          mobile: "",
        };

        await addDoc(profilesCollectionRef, profileData);
      }

      dispatch(login(true));

      navigate("/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div>
      <p>Sign in with Google</p>
      <button onClick={signInWithGoogle}>Sign in</button>
    </div>
  );
}
