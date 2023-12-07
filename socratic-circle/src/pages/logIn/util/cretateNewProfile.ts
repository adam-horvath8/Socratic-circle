import { auth, db } from "@/config/firebase";
import { ProfileDataType } from "@/types/types";
import { addDoc, collection } from "firebase/firestore";

export default async function createNewProfile (){
    const profilesCollectionRef = collection(db, "profiles");

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