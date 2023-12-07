import { auth } from "@/config/firebase";
import { login } from "@/redux/features/auth";
import { AuthStateType } from "@/types/types";
import { onAuthStateChanged, signOut } from "firebase/auth";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function useLogout() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const authState = useSelector((state: AuthStateType) => state.authState);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(login(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return { authState, handleLogOut };
}
