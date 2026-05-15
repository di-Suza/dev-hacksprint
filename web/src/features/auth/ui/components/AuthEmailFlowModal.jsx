import { Check, Mail, X } from "lucide-react";

import { Button } from "../../../../shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import useAuthEmailFlowModal from "./useAuthEmailFlowModal";

function AuthEmailFlowModal({ email, userName, open, password, onOpenChange }) {
  const {
    handleClose,
    handleResendOtp,
    handleVerifyOtpAndRegister,
    isLoading,
    isResending,
    otp,
    setOtp,
  } = useAuthEmailFlowModal({ email, userName, password, onOpenChange });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5 py-8 backdrop-blur-md">
      <Card className="relative w-full max-w-md animate-soft-in border-(--color-border-strong) bg-(--color-bg) shadow-[0_30px_120px_rgba(0,0,0,0.7)]">
        <Button
          aria-label="Close modal"
          className="absolute right-3 top-3"
          size="icon"
          type="button"
          variant="ghost"
          onClick={handleClose}
        >
          <X size={16} aria-hidden="true" />
        </Button>

        <CardHeader className="pr-14">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface)">
            <Mail size={19} className="text-(--color-accent)" aria-hidden="true" />
          </div>

          <CardTitle>Verify your email</CardTitle>
          <CardDescription>
            Enter the OTP sent to {email}. Account will be created after verification.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="grid gap-4" onSubmit={handleVerifyOtpAndRegister}>
            <div className="rounded-lg border border-(--color-border) bg-(--color-surface) p-3 text-xs text-(--color-muted)">
              Registering as <span className="text-(--color-text)">{userName}</span>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-(--color-text)" htmlFor="otp">
                OTP code
              </label>
              <Input
                autoFocus
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6 digit OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
              />
            </div>

            <Button className="w-full" disabled={otp.length !== 6 || isLoading} type="submit">
              <Check size={16} aria-hidden="true" />
              {isLoading ? "Creating account..." : "Verify & Create Account"}
            </Button>

            <Button
              className="w-full"
              disabled={isResending}
              type="button"
              variant="ghost"
              onClick={handleResendOtp}
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthEmailFlowModal;
