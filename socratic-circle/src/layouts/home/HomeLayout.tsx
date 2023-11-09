import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth";
import { AuthStateType } from "@/types/types";
import { useEffect } from "react";

// components import
import { buttonVariants, Button } from "@/components/ui/button";

export interface IHomeLayoutProps {}

export default function HomeLayout(props: IHomeLayoutProps) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const authState = useSelector((state: AuthStateType) => state.authState);

  // Log out

  useEffect(() => {
    if (!authState) {
      navigate("/");
    }
  }, [authState]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      dispatch(login(false));
      localStorage.setItem("isAuth", false.toString());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <nav className="bg-orange-600 text-white min-h-screen flex flex-col flex-auto p-5 gap-2">
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
        <NavLink
          to="create-essay"
          className={buttonVariants({ variant: "outline" })}
        >
          Create Essay
        </NavLink>
        <Button onClick={handleLogOut}>Log out</Button>
      </nav>
      <main className="flex-[10_3_0%]">
        <Outlet></Outlet>
      </main>
    </div>
  );
}
