import { VerifyEmailForm } from "@/components/form/verify-email-form";
import { Suspense } from "react";

export default function VerifyEmailPage() {
    return (
        <main>
            <Suspense fallback={<div>Loading verification form...</div>}>
                <VerifyEmailForm />
            </Suspense>
        </main>
    );
}