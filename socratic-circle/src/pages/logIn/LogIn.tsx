import * as React from "react";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth";
import { useNavigate } from "react-router-dom";

//  types
import { AuthStateType } from "../../types/types";

export interface ILogInProps {}

export default function LogIn(props: ILogInProps) {
  const navigate = useNavigate();

  const authState = useSelector((state: AuthStateType) => state.authState.value);

  const dispatch = useDispatch();

  console.log(authState);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      localStorage.setItem("isAuth", true.toString());
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
