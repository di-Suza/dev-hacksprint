import { useState } from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "../../../../shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card";
import { Input } from "../../../../shared/components/ui/input";
import { Separator } from "../../../../shared/components/ui/separator";
import AuthEmailFlowModal from "../components/AuthEmailFlowModal";
import { useGoogleLoginMutation, useSendOtpMutation } from "../../api/auth.api";
import { setUser } from "../../state/authSlice";

function SignupPage() {
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

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.07),transparent_28%),var(--color-bg)] px-5 py-10 text-(--color-text)">
      <Card className="w-full max-w-sm animate-soft-in border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pb-3">
          <CardTitle>Sign Up or Continue with Google!</CardTitle>
          <CardDescription>
            Add your details, then verify your email with OTP.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <form className="grid gap-3" onSubmit={handleSendOtp}>
            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-dim)"
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="sr-only">Name</span>
              <Input
                className="pl-9"
                type="text"
                placeholder="your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-dim)"
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="sr-only">Email address</span>
              <Input
                className="pl-9"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-dim)"
                size={16}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="sr-only">Password</span>
              <Input
                className="pl-9"
                type="password"
                placeholder="create password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={!name || !email || password.length < 8 || isLoading}
              size="sm"
              type="submit"
            >
              {isLoading ? "Sending OTP..." : "Continue with Email"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-2.5 text-xs uppercase text-(--color-dim)">
            <Separator className="flex-1" />
            <span>or continue with</span>
            <Separator className="flex-1" />
          </div>

          <Button
            className="w-full"
            disabled={isGoogleLoading}
            variant="outline"
            onClick={() => handleGoogleLogin()}
          >
            <span className="text-base font-black">G</span>
            {isGoogleLoading ? "Connecting..." : "Google"}
          </Button>

          <p className="mt-5 text-center text-sm text-(--color-muted)">
            Already have an account?{" "}
            <Link className="font-semibold text-(--color-text) hover:underline" to="/signin">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>

      <AuthEmailFlowModal
        email={email}
        userName={name}
        open={isAuthModalOpen}
        password={password}
        onOpenChange={setIsAuthModalOpen}
      />
    </main>
  );
}

export default SignupPage;
