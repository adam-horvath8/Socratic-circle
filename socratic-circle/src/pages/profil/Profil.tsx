import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/config/firebase";

export interface IProfilProps {}

export default function Profil(props: IProfilProps) {
  return (
    <div>
      <Avatar>
        <AvatarImage src={auth.currentUser?.photoURL} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
        <span>{auth.currentUser?.displayName}</span>
    </div>
  );
}
