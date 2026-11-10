"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
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
import { ForgotPasswordZodSchema } from "@/lib/validation";
import { forgotPassword } from "@/services/forgot-pass";



type FormValues = z.infer<typeof ForgotPasswordZodSchema>;

export function ForgotPasswordForm() {
    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(ForgotPasswordZodSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);

            await forgotPassword(values);
            toast.success(
                "If the email exists, a password reset link has been sent."
            );

            form.reset();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to process request"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <Mail className="mx-auto mb-3 size-8 text-primary" />

                <CardTitle>Forgot your password?</CardTitle>

                <CardDescription>
                    Enter your email and we'll send you a reset link.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...form.register("email")}
                        />

                        {form.formState.errors.email && (
                            <p className="text-sm text-destructive">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>

                    <Button
                        className="w-full"
                        type="submit"
                        disabled={loading}
                    >
                        {loading && (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                        )}

                        Send Reset Link
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    );
}