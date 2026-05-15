import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link } from "react-router";

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
import BackButton from "../../../../shared/components/BackButton";
import AuthEmailFlowModal from "../components/AuthEmailFlowModal";
import useSignupPage from "./useSignupPage";

function SignupPage() {
  const {
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
  } = useSignupPage();

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.07),transparent_28%),var(--color-bg)] px-5 py-10 text-(--color-text)">
      <BackButton className="fixed left-5 top-5" fallback="/" />
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
