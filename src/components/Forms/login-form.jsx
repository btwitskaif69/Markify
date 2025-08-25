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
import { useAuth } from '@/context/AuthContext';
import { Eye,  EyeOff } from "lucide-react";

// --- THIS IS THE FIX ---
// The URL now includes the full path to the login endpoint
const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"}/api/users/login`;

export function LoginForm({ className, ...props }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }
      
      toast.success("Login successful!");
      
      login(data.user, data.token);

      navigate(`/dashboard/${data.user.id}`);

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
     <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className={cn("w-full max-w-md", className)} {...props}>
        <CardHeader>
          <CardTitle className="text-2xl">Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com" // Improved placeholder
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                  className="bg-background!"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                {/* 3. Wrap Input and Button for positioning */}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    required
                    className="bg-background!"
                  />
                    {formData.password.length > 0 && (
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-0 right-0 h-full px-3 flex items-center cursor-pointer select-none"
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <Button variant="outline" className="w-full bg-background!" disabled={isLoading}>
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}