import { db } from "@/config/firebase";
import { ProfileDataType } from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardTitle } from "./ui/card";

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
    <div className="flex w-full flex-col gap-6 justify-center">
      <Card className="p-3 ">
        <CardTitle className="mb-3">About me</CardTitle>
        <span>{displayedProfileData?.about}</span>
      </Card>
      <div className="flex gap-6">
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">First Name</CardTitle>
          <span className="sm:text-2xl">{displayedProfileData?.firstName}</span>
        </Card>
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">Surname</CardTitle>
          <span className="sm:text-2xl">{displayedProfileData?.lastName}</span>
        </Card>
      </div>
      <div className="flex gap-6">
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">Current City</CardTitle>
          <span className="sm:text-xl lg:text-2xl">
            {displayedProfileData?.currentCity}
          </span>
        </Card>
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">Home Town</CardTitle>
          <span className="sm:text-xl lg:text-2xl">
            {displayedProfileData?.homeTown}
          </span>
        </Card>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">Degree</CardTitle>
          <span className="sm:text-xl lg:text-2xl">
            {displayedProfileData?.degree}
          </span>
        </Card>
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">School</CardTitle>
          <span className="sm:text-xl lg:text-2xl">
            {displayedProfileData?.school}
          </span>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">Email</CardTitle>
          <span className="sm:text-xl lg:text-2xl">
            {displayedProfileData?.email}
          </span>
        </Card>
        <Card className="p-3 flex-1">
          <CardTitle className="mb-3 text-sm">Mobile</CardTitle>
          <span className="sm:text-xl lg:text-2xl">
            {displayedProfileData?.mobile}
          </span>
        </Card>
      </div>
    </div>
  );
}
