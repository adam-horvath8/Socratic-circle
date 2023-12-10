import { auth, db } from "@/config/firebase";
import { authPromise } from "@/lib/authPromise";
import { ProfileDataType } from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

const useGetUserProfile = () => {
  const [profileDataState, setProfileDataState] =
    useState<ProfileDataType | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getUserProfile = async () => {
    try {
      await authPromise;

      const q = query(
        collection(db, "profiles"),
        where("userId", "==", auth.currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const usersProfile = {
          id: querySnapshot.docs[0].id,
          ...querySnapshot.docs[0].data(),
        } as ProfileDataType;

        console.log(usersProfile);

        setProfileDataState(usersProfile);
      } else {
        setError("Error: Could not get the data");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  return { profileDataState, error, loading, getUserProfile };
};

export default useGetUserProfile;
