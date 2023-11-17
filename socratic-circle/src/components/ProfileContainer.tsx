import { db } from "@/config/firebase";
import { ProfileDataType } from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface IProfileContainerProps {
  id?: string;
  profileDataState?: ProfileDataType | null;
}

export default function ProfileContainer({
  id,
  profileDataState,
}: IProfileContainerProps) {
  const [displayedProfileData, setDisplayedProfileData] = useState(
    profileDataState || null
  );

  const profileCollectionRef = collection(db, "profiles");

  const getUserProfileData = async () => {
    try {
      const q = query(profileCollectionRef, where("userId", "==", id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const usersProfile = querySnapshot.docs[0].data() as ProfileDataType;
        setDisplayedProfileData(usersProfile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id && profileDataState) {
      setDisplayedProfileData(profileDataState);
    } else if (id) {
      getUserProfileData();
    }
  }, [id, profileDataState]);

  return (
    <div className="flex gap-4">
      <span>{displayedProfileData?.firstName}</span>
      <span>{displayedProfileData?.lastName}</span>
      <span>{displayedProfileData?.about}</span>
      <span>{displayedProfileData?.school}</span>
      <span>{displayedProfileData?.currentCity}</span>
      <span>{displayedProfileData?.homeTown}</span>
      <span>{displayedProfileData?.email}</span>
      <span>{displayedProfileData?.mobile}</span>
    </div>
  );
}
