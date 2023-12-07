import { auth, db, provider } from "@/config/firebase";
import { login } from "@/redux/features/auth";
import { signInWithPopup } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import createNewProfile from "./cretateNewProfile";

const useHandleLogin = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);

      const q = query(
        collection(db, "profiles"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await createNewProfile();
      }

      dispatch(login(true));

      navigate("/in/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return { signInWithGoogle };
};

export default useHandleLogin;
