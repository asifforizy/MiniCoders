"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

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
import { ResetPasswordZodSchema } from "@/lib/validation";
import { resetPassword } from "@/services/reset-pass";



type FormValues = z.infer<typeof ResetPasswordZodSchema>;

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const email = searchParams.get("email") ?? "";

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(ResetPasswordZodSchema),
        defaultValues: { otp: "", password: "", confirmPassword: "" },
    });

    const onSubmit = async (values: FormValues) => {
        if (!email) {
            toast.error("Email is missing. Please request a new code.");
            return;
        }

        try {
            setLoading(true);

            const result = await resetPassword({
                email,
                otp: values.otp,
                newPassword: values.password,
            });

            if (!result.success) {
                toast.error(result.message);
                return;
            }

            toast.success("Password reset successful");
            router.replace("/login");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Password reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!email) {
        return (
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Reset Password</CardTitle>

                    <CardDescription>
                        We could not find the email address for this reset
                        request.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Button
                        className="w-full"
                        nativeButton={false}
                        render={<Link href="/forgot-password" />}
                    >
                        Request a new code
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle>Reset Password</CardTitle>

                <CardDescription>
                    Enter the 6-digit code sent to {email} and choose a new
                    password. The code expires in 5 minutes.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <Label htmlFor="otp">Verification code</Label>

                        <Input
                            id="otp"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="123456"
                            className="text-center text-lg tracking-widest"
                            {...form.register("otp")}
                        />

                        {form.formState.errors.otp && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.otp.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>

                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="pr-10"
                                {...form.register("password")}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((value) => !value)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>

                        {form.formState.errors.password && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>

                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword ? "text" : "password"
                                }
                                className="pr-10"
                                {...form.register("confirmPassword")}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword((value) => !value)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>

                        {form.formState.errors.confirmPassword && (
                            <p className="text-sm text-destructive">
                                {
                                    form.formState.errors.confirmPassword
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}

                        Reset Password
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Need a new code?{" "}
                        <Link
                            href="/forgot-password"
                            className="font-medium text-primary hover:underline"
                        >
                            Request another
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}
