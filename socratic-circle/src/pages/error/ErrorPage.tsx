import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ErrorPage() {

  return (
    <div className="w-screen h-screen flex flex-col gap-6 justify-center items-center">
      <h1>Page not Found</h1>
      <Link to="in/home" className={buttonVariants()}>
        Go to Home Page
      </Link>
    </div>
  );
}
