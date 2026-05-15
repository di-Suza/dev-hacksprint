import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useSendOtpMutation, useVerifyAndRegisterMutation } from "../../api/auth.api";
import { setUser } from "../../state/authSlice";

function useAuthEmailFlowModal({ email, userName, password, onOpenChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [verifyAndRegister, { isLoading }] = useVerifyAndRegisterMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  async function handleVerifyOtpAndRegister(event) {
    event.preventDefault();

    try {
      const data = await verifyAndRegister({ otp, userName, email, password }).unwrap();
      dispatch(setUser(data));
      toast.success("Account created successfully");
      setOtp("");
      onOpenChange(false);
      navigate("/feed", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || "OTP verification failed");
    }
  }

  async function handleResendOtp() {
    try {
      await sendOtp({ email }).unwrap();
      toast.success("OTP resent");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to resend OTP");
    }
  }

  function handleClose() {
    setOtp("");
    onOpenChange(false);
  }

  return {
    handleClose,
    handleResendOtp,
    handleVerifyOtpAndRegister,
    isLoading,
    isResending,
    otp,
    setOtp,
  };
}

export default useAuthEmailFlowModal;
