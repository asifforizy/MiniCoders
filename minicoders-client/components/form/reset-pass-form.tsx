"use client";

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

    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(ResetPasswordZodSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (values: FormValues) => {
        if (!token) {
            toast.error("Invalid or missing reset token");
            return;
        }

        try {
            setLoading(true);

            await resetPassword({ token, password: values.password });

            toast.success("Password reset successful");
            router.push("/login");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Password reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle>Reset Password</CardTitle>

                <CardDescription>
                    Create a new password for your account.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <Label>New Password</Label>

                        <div className="relative">
                            <Input
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
                        <Label>Confirm Password</Label>

                        <div className="relative">
                            <Input
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
                </form>
            </CardContent>
        </Card>
    );
}