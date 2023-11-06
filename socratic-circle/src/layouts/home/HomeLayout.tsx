import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth";

// components import
import { buttonVariants, Button } from "@/components/ui/button";

export interface IHomeLayoutProps {}

export default function HomeLayout(props: IHomeLayoutProps) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      dispatch(login(false));
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex ">
      <nav className="bg-orange-600 text-white min-h-screen flex flex-col p-5 gap-2">
        <NavLink to="" className={buttonVariants({ variant: "outline" })}>
          Feed
        </NavLink>
        <NavLink
          to="profile"
          className={buttonVariants({ variant: "outline" })}
        >
          Profile
        </NavLink>
        <NavLink
          to="my-essays"
          className={buttonVariants({ variant: "outline" })}
        >
          My Essays
        </NavLink>
        <Button onClick={handleLogOut}>Log out</Button>
      </nav>
      <main>
        <Outlet></Outlet>
      </main>
    </div>
  );
}
