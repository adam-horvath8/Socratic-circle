import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "@/config/firebase";
import { login } from "@/redux/features/auth";

const AuthObserver = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        dispatch(login(true));
      } else {
        dispatch(login(false));
      }
    });

    // Clean up the observer when the component is unmounted
    return () => unsubscribe();
  }, [dispatch]);

  return null;
};

export default AuthObserver;
