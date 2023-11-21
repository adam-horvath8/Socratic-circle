import { auth, db, provider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth";
import { useNavigate } from "react-router-dom";
import { ProfileDataType } from "@/types/types";
import loginImg from "../../assets/pic/LogIn.jpg";
import logo from "../../assets/pic/2.png";
import google from "../../assets/svg/Google.svg";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";

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

      navigate("/in/home");
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  console.log(loginImg); // Check the path in the console

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center lg:items-start gap-32 p-10">
      <img
        src={loginImg}
        alt=""
        className="absolute max-h-screen end-0 hidden lg:block"
      />
      <div className="z-10 flex flex-col items-center gap-6">
        <img
          src={logo}
          alt="logo"
          className="max-w-[14rem] rounded-full mb-6 sm:max-w-md lg:max-w-[14rem]"
        />
        <p className="text-xl max-w-md text-center sm:max-w-lg sm:text-3xl lg:text-2xl lg:max-w-sm">
          Connect with philosophers around the world and share your ideas!
        </p>
        <Button
          className="w-60 flex justify-center gap-4 sm:w-3/4 sm:text-2xl sm:p-10 lg:text-[1rem] z-10 "
          variant="secondary"
          onClick={signInWithGoogle}
        >
          <img src={google} alt="google logo" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
