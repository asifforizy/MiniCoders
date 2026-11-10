import { Suspense } from "react";
import { LoginForm } from "@/components/form/login-form";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-10">
            <Suspense fallback={<div>Loading login form...</div>}>
                <LoginForm />
            </Suspense> </main>
    );
}
