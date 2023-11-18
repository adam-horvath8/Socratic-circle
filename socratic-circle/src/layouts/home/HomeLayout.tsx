import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/auth";
import { AuthStateType } from "@/types/types";
import { useEffect } from "react";

import logo from "../../assets/pic/2.png";

// components import
import { buttonVariants, Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface IHomeLayoutProps {}

export default function HomeLayout(props: IHomeLayoutProps) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const authState = useSelector((state: AuthStateType) => state.authState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(login(false));
      }
    });

    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  console.log(authState);

  return (
    <div className=" relative sm:flex">
      <DropdownMenu>
        <div className="flex flex-col w-screen sm:hidden">
          <DropdownMenuTrigger className="bg-orange-600 fixed w-screen min-h-[3rem] p-1">
            <img src={logo} alt="" className="w-[40px] h-[45px] absolute top-0" />
            <span className="material-symbols-outlined flex justify-center">
              menu
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex-1 w-screen">
            <nav className="bg-orange-600 text-white flex flex-col flex-auto p-2 gap-2">
              {authState ? (
                <>
                  <NavLink
                    to=""
                    className={
                      buttonVariants({ variant: "outline" }) + "flex-1"
                    }
                  >
                    <span className="material-symbols-outlined">home</span>
                    Home
                  </NavLink>

                  <NavLink
                    to="profile"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <span className="material-symbols-outlined">person</span>
                    Profile
                  </NavLink>

                  <NavLink
                    to="my-essays"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <span className="material-symbols-outlined">subject</span>
                    My Essays
                  </NavLink>

                  <NavLink
                    to="create-essay"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <span className="material-symbols-outlined">
                      docs_add_on
                    </span>
                    Create Essay
                  </NavLink>

                  <Button onClick={handleLogOut}>
                    <span className="material-symbols-outlined">
                      <span className="material-symbols-outlined">logout</span>
                    </span>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink
                    to=""
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Home
                  </NavLink>

                  <Button onClick={handleLogOut}>Sign In</Button>
                </>
              )}
            </nav>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>

      <div className="flex-1 hidden sm:block">
        <nav className="bg-orange-600 text-white min-h-screen flex flex-col flex-auto  p-5 gap-2 fixed">
          <img src={logo} alt="" className="w-[100px] h-[100px]" />
          {authState ? (
            <>
              <NavLink to="" className={buttonVariants({ variant: "outline" })}>
                <span className="material-symbols-outlined">home</span>
                Home
              </NavLink>
              <NavLink
                to="profile"
                className={buttonVariants({ variant: "outline" })}
              >
                <span className="material-symbols-outlined">person</span>
                Profile
              </NavLink>
              <NavLink
                to="my-essays"
                className={buttonVariants({ variant: "outline" })}
              >
                <span className="material-symbols-outlined">subject</span>
                My Essays
              </NavLink>
              <NavLink
                to="create-essay"
                className={buttonVariants({ variant: "outline" })}
              >
                <span className="material-symbols-outlined">docs_add_on</span>
                Create Essay
              </NavLink>
              <Button onClick={handleLogOut}>
                <span className="material-symbols-outlined">
                  <span className="material-symbols-outlined">logout</span>
                </span>
                Log out
              </Button>
            </>
          ) : (
            <>
              <NavLink to="" className={buttonVariants({ variant: "outline" })}>
                Home
              </NavLink>
              <Button onClick={handleLogOut}>Sign In</Button>
            </>
          )}
        </nav>
      </div>

      <main className="flex-[8_1_0%] p-5 mt-[3rem] sm:mt-0 sm:p-10 lg:p-20">
        <Outlet />
      </main>
    </div>
  );
}
