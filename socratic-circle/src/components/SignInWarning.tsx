import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

export default function SignInWarning() {
  const navigate = useNavigate();

  const handleSingInButton = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      <h1 className="text-3xl">To create essay you need to be logged in</h1>
      <Button onClick={handleSingInButton} className="w-1/4">
        <span className="material-symbols-outlined">login</span>Sign In
      </Button>
    </div>
  );
}
