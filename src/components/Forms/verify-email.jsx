import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { secureFetch } from "@/lib/secureApi";
import { API_BASE_URL } from "@/lib/apiConfig";
import { Mail, RefreshCw } from "lucide-react";

const VERIFY_URL = `${API_BASE_URL}/users/verify-email`;
const RESEND_URL = `${API_BASE_URL}/users/resend-verification`;

export function VerifyEmail({ className, ...props }) {
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Only take last character
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newCode = pastedData.split("");
        while (newCode.length < 6) newCode.push("");
        setCode(newCode);

        // Focus last filled input or last input
        const lastIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[lastIndex]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullCode = code.join("");

        if (fullCode.length !== 6) {
            toast.error("Please enter the complete 6-digit code.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await secureFetch(VERIFY_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: fullCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Verification failed.");
            }

            toast.success("Account verified successfully!");
            login(data.user, data.token);
            navigate(`/dashboard/${data.user.id}?welcome=true`);
        } catch (error) {
            console.error("Verification error:", error);
            toast.error(error.message);
            // Clear code on error
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);

        try {
            const response = await secureFetch(RESEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to resend code.");
            }

            toast.success("New verification code sent!");
            setResendCooldown(60); // 60 second cooldown
            setCode(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error) {
            console.error("Resend error:", error);
            toast.error(error.message);
        } finally {
            setIsResending(false);
        }
    };

    if (!email) {
        navigate("/signup");
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className={cn("w-full max-w-md", className)} {...props}>
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Verify your email</CardTitle>
                    <CardDescription>
                        We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            {/* Code Inputs */}
                            <div className="flex justify-center gap-2">
                                {code.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        disabled={isLoading}
                                        className="h-14 w-12 text-center text-2xl font-bold bg-background"
                                    />
                                ))}
                            </div>

                            {/* Verify Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading || code.some((d) => !d)}
                            >
                                {isLoading ? "Verifying..." : "Verify Email"}
                            </Button>

                            {/* Resend Section */}
                            <div className="text-center text-sm text-muted-foreground">
                                Didn't receive the code?{" "}
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={isResending || resendCooldown > 0}
                                    className={cn(
                                        "inline-flex items-center gap-1 font-medium underline underline-offset-4",
                                        resendCooldown > 0
                                            ? "text-muted-foreground cursor-not-allowed"
                                            : "text-primary hover:text-primary/90"
                                    )}
                                >
                                    {isResending ? (
                                        <>
                                            <RefreshCw className="h-3 w-3 animate-spin" />
                                            Sending...
                                        </>
                                    ) : resendCooldown > 0 ? (
                                        `Resend in ${resendCooldown}s`
                                    ) : (
                                        "Resend code"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default VerifyEmail;
