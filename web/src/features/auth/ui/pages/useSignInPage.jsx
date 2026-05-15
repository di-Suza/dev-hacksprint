import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useGoogleLoginMutation, useLoginMutation } from "../../api/auth.api";
import { setUser } from "../../state/authSlice";

function useSignInPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
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

  async function handleSignin(event) {
    event.preventDefault();

    try {
      const data = await login({ email, password }).unwrap();
      dispatch(setUser(data));
      toast.success("Logged in successfully");
      navigate("/feed", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  }

  return {
    email,
    handleGoogleLogin,
    handleSignin,
    isGoogleLoading,
    isLoading,
    password,
    setEmail,
    setPassword,
  };
}

export default useSignInPage;
