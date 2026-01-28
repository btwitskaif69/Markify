"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useAuth } from '@/client/context/AuthContext';
import { Eye, EyeOff } from "lucide-react";
import { secureFetch } from "@/client/lib/secureApi";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import SEO from "@/components/SEO/SEO";

// The URL now includes the full path to the login endpoint
const API_URL = `${API_BASE_URL}/users/login`;
const GOOGLE_AUTH_URL = `${API_BASE_URL}/users/google-auth`;

import { signInWithGoogle, initializationError } from "@/client/lib/firebase";

export function LoginForm({ className, ...props }) {
  const { login, isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.replace(`/dashboard/${user.id}`);
    }
  }, [isAuthenticated, user, authLoading, router]);
  // ... existing state ...
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [lastLoginMethod, setLastLoginMethod] = useState(null);

  useEffect(() => {
    try {
      const storedMethod = window.localStorage.getItem("lastLoginMethod");
      if (storedMethod) {
        setLastLoginMethod(storedMethod);
      }
    } catch {
      // Ignore storage access errors (e.g. privacy mode).
    }
  }, []);

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
        throw new Error(data.message || "Google Login failed.");
      }

      toast.success("Logged in with Google successfully!");
      login(data.user, data.token);
      try {
        localStorage.setItem("lastLoginMethod", "google");
      } catch {
        // Ignore storage access errors.
      }
      setLastLoginMethod("google");

      if (data.isNewUser) {
        router.push(`/dashboard/${data.user.id}?welcome=true`);
      } else {
        router.push(`/dashboard/${data.user.id}`);
      }
    } catch (error) {
      console.error("Google Login error:", error);
      toast.error(error.message || "Failed to login with Google.");
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
        throw new Error(data.message || "Login failed. Please try again.");
      }

      toast.success("Logged in successfully!");
      login(data.user, data.token);
      try {
        localStorage.setItem("lastLoginMethod", "email");
      } catch {
        // Ignore storage access errors.
      }
      setLastLoginMethod("email");
      router.push(`/dashboard/${data.user.id}`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background! p-4">
      <SEO
        title="Log in"
        description="Log in to your Markify account."
        noindex
      />
      <Card className={cn("w-full max-w-md bg-black border-zinc-800 text-white", className)} {...props}>
        <CardHeader>
          {initializationError && (
            <div className="mb-4 p-3 rounded-md bg-red-950/50 border border-red-900 text-red-200 text-sm">
              <p className="font-semibold mb-1">Configuration Error</p>
              <p>{initializationError}</p>
              <p className="mt-1 text-xs text-red-300">Check your environment variables.</p>
            </div>
          )}
          <CardTitle className="text-2xl text-white">Login to your account</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your email and password below to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="bg-background!"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Link href="/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-zinc-400 hover:text-primary">
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    maxLength={64}
                    className="bg-background!"
                  />
                  {formData.password.length > 0 && (
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-0 right-0 h-full px-3 flex items-center cursor-pointer select-none text-zinc-400 hover:text-white"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </div>
                  )}

                </div>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <div className="relative">
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                  {lastLoginMethod === 'email' && (
                    <span className="absolute -top-3 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 animate-in fade-in zoom-in duration-300">
                      Last Used
                    </span>
                  )}
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-zinc-800">
                  <span className="relative z-10 bg-black px-2 text-zinc-400">
                    Or continue with
                  </span>
                </div>

                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-black border-zinc-800 text-white hover:bg-zinc-900 hover:text-white"
                    disabled={isLoading}
                    onClick={handleGoogleLogin}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" className="w-5 h-5 mr-2 dark:fill-white fill-white">
                      <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
                    </svg>
                    Login with Google
                  </Button>
                  {lastLoginMethod === 'google' && (
                    <span className="absolute -top-3 right-0 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 animate-in fade-in zoom-in duration-300">
                      Last used
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center text-xs text-zinc-400 mt-4 text-balance">
                By clicking continue, you agree to our{" "}
                <a href="/terms" className="underline underline-offset-4 hover:text-white">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline underline-offset-4 hover:text-white">
                  Privacy Policy
                </a>
                .
              </div>
            </div>
            <div className="mt-4 text-center text-sm text-zinc-400">
              Don't have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4 hover:text-primary text-white">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
