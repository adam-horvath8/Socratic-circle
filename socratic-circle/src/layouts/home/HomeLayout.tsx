import Navigation from "./components/Navigation";
import DropdownNav from "./components/DropdownNav";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div>
      <DropdownNav />
      <Navigation />
      <main className="flex-[8_1_0%] p-5 mt-[3rem] sm:ml-44  sm:mt-0 sm:p-10 lg:px-40">
        <Outlet />
      </main>
    </div>
  );
}
