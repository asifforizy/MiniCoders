import { Suspense } from "react";


export default function ResetPasswordPage() {
    return (
        <main>
            <Suspense fallback={<div>Loading reset form...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}