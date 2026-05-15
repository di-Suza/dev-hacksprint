import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useGoogleLoginMutation, useSendOtpMutation } from "../../api/auth.api";
import { setUser } from "../../state/authSlice";

function useSignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        const data = await googleLogin(code).unwrap();
        dispatch(setUser(data));
        toast.success("Logged in with Google");
        navigate("/feed", { replace: true });
      } catch (error) {
        toast.error(error?.data?.message || "Google login failed");
      }
    },
    onError: () => {
      toast.error("Google login was cancelled");
    },
  });

  async function handleSendOtp(event) {
    event.preventDefault();

    try {
      await sendOtp({ email }).unwrap();
      toast.success("OTP sent to your email");
      setIsAuthModalOpen(true);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to send OTP");
    }
  }

  return {
    email,
    handleGoogleLogin,
    handleSendOtp,
    isAuthModalOpen,
    isGoogleLoading,
    isLoading,
    name,
    password,
    setEmail,
    setIsAuthModalOpen,
    setName,
    setPassword,
  };
}

export default useSignupPage;
