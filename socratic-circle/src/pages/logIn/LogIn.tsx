import { auth, db, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { ProfileDataType } from "@/types/types";

//  types


export default function LogIn() {
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
        const profileData: ProfileDataType = {
          userId: auth.currentUser?.uid,
          userPhoto: auth.currentUser?.photoURL,
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
