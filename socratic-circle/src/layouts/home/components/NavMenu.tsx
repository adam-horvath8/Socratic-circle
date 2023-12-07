import useLogout from "@/hooks/useLogout";
import { NavLink } from "react-router-dom";
import { buttonVariants, Button } from "@/components/ui/button";
import logo from "../../../assets/pic/2.png";

interface INavMenu {
  isDesktopWidth: boolean;
}

export function NavMenu({ isDesktopWidth }: INavMenu) {
  const { authState, handleLogOut } = useLogout();

  const navClasses = isDesktopWidth
    ? "bg-orange-600 text-white min-h-screen flex flex-col flex-auto p-5 gap-2"
    : "bg-orange-600 text-white flex flex-col flex-auto p-2 gap-2";

  return (
    <nav className={navClasses}>
      {isDesktopWidth && (
        <img src={logo} alt="" className="w-[100px] h-[100px] self-center" />
      )}
      {authState ? (
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
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Home
          </NavLink>

          <Button onClick={handleLogOut}>Sign In</Button>
        </>
      )}
    </nav>
  );
}
