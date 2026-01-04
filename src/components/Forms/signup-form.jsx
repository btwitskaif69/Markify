import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { secureFetch } from "@/lib/secureApi";
import { API_BASE_URL } from "@/lib/apiConfig";
import SEO from "@/components/SEO/SEO";
import PasswordInput from "@/components/password-input-2";

// API URL to initiate signup endpoint
const API_URL = `${API_BASE_URL}/users/initiate-signup`;
const GOOGLE_AUTH_URL = `${API_BASE_URL}/users/google-auth`;

import { signInWithGoogle, initializationError } from "@/lib/firebase";

export function SignupForm({ className, ...props }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const firebaseUser = await signInWithGoogle();
      const idToken = await firebaseUser.getIdToken();

      const response = await secureFetch(GOOGLE_AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Google Signup failed.");
      }

      toast.success("Signed up with Google successfully!");
      toast.success("Signed up with Google successfully!");
      login(data.user, data.token);

      if (data.isNewUser) {
        navigate(`/dashboard/${data.user.id}?welcome=true`);
      } else {
        navigate(`/dashboard/${data.user.id}`);
      }
    } catch (error) {
      console.error("Google Signup error:", error);
      toast.error(error.message || "Failed to sign up with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await secureFetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      toast.success("Verification code sent to your email!");
      navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background! p-4">
      <SEO
        title="Sign up"
        description="Create your Markify account."
        noindex
      />
      <Card className={cn("w-full max-w-md", className)} {...props}>
        <CardHeader>
          {initializationError && (
            <div className="mb-4 p-3 rounded-md bg-red-950/50 border border-red-900 text-red-200 text-sm">
              <p className="font-semibold mb-1">Configuration Error</p>
              <p>{initializationError}</p>
              <p className="mt-1 text-xs text-red-300">Check your environment variables.</p>
            </div>
          )}
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create your new account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background!"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-background!"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-background"
                  disabled={isLoading}
                  type="button"
                  onClick={handleGoogleLogin}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-5 h-5 mr-2 dark:fill-white fill-black">
                    <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
                  </svg>
                  Sign up with Google
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

