import { NavMenu } from "./NavMenu";
import logo from "../../../assets/pic/2.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DropdownNav() {
  return (
    <div className="flex flex-col w-screen sm:hidden z-50">
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-orange-600 fixed w-screen min-h-[3rem] p-1 z-50">
          <img src={logo} alt="" className="w-[40px] h-[45px] absolute top-0" />
          <span className="material-symbols-outlined flex justify-center">
            menu
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex-1 w-screen">
          <NavMenu isDesktopWidth={false} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
