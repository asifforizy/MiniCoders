import { Suspense } from "react";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GoogleProvider } from "@/provider/google-provider";
import { getMe } from "@/services/getme";

async function NavbarWithUser() {
  const user = await getMe();

  return <Navbar user={user} />;
}

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<div className="h-16" />}>
        <NavbarWithUser />
      </Suspense>
      <GoogleProvider>{children}</GoogleProvider>
      <Footer />
    </div>
  );
};

export default SuperAdminLayout;
