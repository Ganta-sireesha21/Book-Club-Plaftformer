import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Mail, Lock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);

        if (error) {
          toast({
            title: "Login failed",
            description: error,
            variant: "destructive",
          });
          return;
        }

        navigate("/");
      }

      else if (mode === "signup") {
        const { error } = await signUp(email, password, displayName);

        if (error) {
          toast({
            title: "Signup failed",
            description: error,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Check your email",
          description: "We sent you a confirmation link.",
        });
      }

      else {
        const { error } = await resetPassword(email);

        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Check your email",
          description: "Password reset link sent.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <BookOpen className="h-8 w-8" />
            <span className="font-display text-2xl font-bold">BookClub</span>
          </div>

          <p className="text-muted-foreground text-sm">
            Your reading community awaits
          </p>
        </div>

        <Card>
          <CardHeader>

            <CardTitle className="font-display">
              {mode === "login"
                ? "Welcome back"
                : mode === "signup"
                ? "Create account"
                : "Reset password"}
            </CardTitle>

            <CardDescription>
              {mode === "login"
                ? "Sign in to your account"
                : mode === "signup"
                ? "Join the book club"
                : "Enter your email to reset"}
            </CardDescription>

          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-4">

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>

                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="name"
                      placeholder="Your name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode !== "forgot" && (
                <div className="space-y-2">

                  <Label htmlFor="password">Password</Label>

                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                      minLength={6}
                    />

                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting
                  ? "Please wait…"
                  : mode === "login"
                  ? "Sign In"
                  : mode === "signup"
                  ? "Create Account"
                  : "Send Reset Link"}
              </Button>

            </form>

            <div className="mt-4 text-center text-sm space-y-1">

              {mode === "login" && (
                <>
                  <button
                    onClick={() => setMode("forgot")}
                    className="text-primary hover:underline block mx-auto"
                  >
                    Forgot password?
                  </button>

                  <p className="text-muted-foreground">
                    Don't have an account?
                    <button
                      onClick={() => setMode("signup")}
                      className="text-primary hover:underline ml-1"
                    >
                      Sign up
                    </button>
                  </p>
                </>
              )}

              {mode === "signup" && (
                <p className="text-muted-foreground">
                  Already have an account?
                  <button
                    onClick={() => setMode("login")}
                    className="text-primary hover:underline ml-1"
                  >
                    Sign in
                  </button>
                </p>
              )}

              {mode === "forgot" && (
                <button
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline"
                >
                  Back to login
                </button>
              )}

            </div>

          </CardContent>
        </Card>

      </motion.div>
    </div>
  );
}