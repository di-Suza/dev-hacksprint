import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
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
import { useGoogleLoginMutation, useLoginMutation } from "../../api/auth.api";
import { setUser } from "../../state/authSlice";

function SignInPage() {
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

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.07),transparent_28%),var(--color-bg)] px-5 py-10 text-(--color-text)">
      <Card className="w-full max-w-sm animate-soft-in border-0 bg-transparent shadow-none">
        <CardHeader className="px-0 pb-3">
          <CardTitle>Sign In or Continue with Google!</CardTitle>
          <CardDescription>
            Enter your email and password to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <form className="grid gap-3" onSubmit={handleSignin}>
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
                placeholder="your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <Button
              className="w-full"
              disabled={!email || password.length < 8 || isLoading}
              size="sm"
              type="submit"
            >
              {isLoading ? "Signing in..." : "Continue with Email"}
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
            New user?{" "}
            <Link className="font-semibold text-(--color-text) hover:underline" to="/signup">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default SignInPage;
