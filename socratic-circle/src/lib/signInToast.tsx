import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const signInToast = () => {
  const authState = useSelector((state: any) => state.authState);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSingInButton = () => {
    navigate("/");
  };

  console.log(authState);
  

  useEffect(() => {
    if (!authState) {
      toast({
        variant: "destructive",
        title: "To enable, please Sign in.",
        action: (
          <ToastAction onClick={handleSingInButton} altText="Sign In">
            Sign In
          </ToastAction>
        ),
      });
    }
  }, [authState]);
};

export default signInToast;
