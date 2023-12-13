import { auth } from "@/config/firebase";
import useGetUserProfile from "./util/getUserProfile";

// Components
import { ProfileForm } from "./components/ProfileForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileContainer from "@/pages/profil/components/ProfileContainer";

export default function Profil() {
  const { profileDataState, error, loading } = useGetUserProfile();

  const photoURL = auth.currentUser?.photoURL;

  console.log(profileDataState);

  return (
    <div className="flex flex-col items-center ">
      {loading ? (
        <div className="flex flex-col items-center gap-5 w-full">
          <Skeleton className="w-[200px] h-[200px] rounded-full" />
          <Skeleton className="w-full h-[200px] " />
          <div className="w-full h-[200px] grid grid-cols-2 gap-6">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      ) : error ? (
        <span className="text-3xl">{error}</span>
      ) : (
        <>
          <ProfileForm profileDataState={profileDataState} />
          <Avatar className="m-6">
            {photoURL ? (
              <AvatarImage src={photoURL} />
            ) : (
              <AvatarFallback>CN</AvatarFallback>
            )}
          </Avatar>
          <ProfileContainer profileDataState={profileDataState} />
        </>
      )}
    </div>
  );
}
