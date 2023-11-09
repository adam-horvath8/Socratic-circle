import * as React from "react";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth";
import { useNavigate } from "react-router-dom";

//  types

export interface ILogInProps {}

export default function LogIn(props: ILogInProps) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      localStorage.setItem("isAuth", true.toString());
      dispatch(login(true));
      console.log(auth.currentUser);
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
