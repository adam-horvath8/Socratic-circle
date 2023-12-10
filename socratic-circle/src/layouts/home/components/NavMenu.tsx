import useLogout from "@/hooks/useLogout";
import { NavLink } from "react-router-dom";
import { buttonVariants, Button } from "@/components/ui/button";
import logo from "../../../assets/pic/2.png";
import { useSelector } from "react-redux";

interface INavMenu {
  isDesktopWidth: boolean;
}

export function NavMenu({ isDesktopWidth }: INavMenu) {
  const { handleLogOut } = useLogout();
  const authState = useSelector((state: any) => state.authState);

  const navClasses = isDesktopWidth
    ? "bg-orange-600 text-white min-h-screen flex flex-col flex-auto p-5 gap-2"
    : "bg-orange-600 text-white flex flex-col flex-auto p-2 gap-2";

  return (
    <nav className={navClasses}>
      {isDesktopWidth && (
        <img src={logo} alt="" className="w-[100px] h-[100px] self-center" />
      )}

      <>
        <NavLink
          to="home"
          className={
            buttonVariants({
              variant: "outline",
            }) + "flex-1"
          }
        >
          <span className="material-symbols-outlined">home</span>
          Home
        </NavLink>

        <NavLink
          to="profile"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          <span className="material-symbols-outlined">person</span>
          Profile
        </NavLink>

        <NavLink
          to="my-essays"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          <span className="material-symbols-outlined">subject</span>
          My Essays
        </NavLink>

        <NavLink
          to="create-essay"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          <span className="material-symbols-outlined">docs_add_on</span>
          Create Essay
        </NavLink>

        <Button onClick={handleLogOut}>
          <span className="material-symbols-outlined">{authState ? "logout" : "login"}</span>
          {authState ? "Sign out" : "Sign in"}
        </Button>
      </>
    </nav>
  );
}
