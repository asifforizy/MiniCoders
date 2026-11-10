"use client";

import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { googleLogin } from "@/services/google";
import { refreshProfile } from "@/services/refresh-profile";



export function GoogleAuthButton() {
  const router = useRouter();

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async (res) => {
          if (!res.credential) {
            toast.error("Google did not return a credential");
            return;
          }
          try {
            await googleLogin({ idToken: res.credential });
            await refreshProfile();
            toast.success("Login successful");
            router.push("/");
            router.refresh();
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Google login failed"
            );
          }
        }}
        onError={() => toast.error("Google login failed")}
      />
    </div>
  );
}