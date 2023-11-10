import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/config/firebase";

export interface IProfilProps {}

export default function Profil(props: IProfilProps) {
  const photoURL = auth.currentUser?.photoURL;
  
  return (
    <div>
      <Avatar>
        {photoURL ? (
          <AvatarImage src={photoURL} />
        ) : (
          <AvatarFallback>CN</AvatarFallback>
        )}
      </Avatar>
      <span>{auth.currentUser?.displayName}</span>
    </div>
  );
}
