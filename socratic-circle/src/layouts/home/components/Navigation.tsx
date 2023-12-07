import { NavMenu } from "./NavMenu";

export default function Navigation() {
  return (
    <div className="hidden sm:block fixed">
      <NavMenu isDesktopWidth={true} />
    </div>
  );
}
