import { Suspense } from 'react'
import { Navbar } from '@/components/shared/navbar'
import React from 'react'
import { getMe } from '@/services/getme'
import { GoogleProvider } from '@/provider/google-provider'
import { Footer } from '@/components/shared/footer'

async function NavbarWithUser() {
  const user = await getMe()
  return <Navbar user={user} /> 
}

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Suspense fallback={<div className="h-16" />}>
        <NavbarWithUser />
      </Suspense>
      <GoogleProvider>{children}</GoogleProvider>
      <Footer></Footer>
      
    </div>
  )
}

export default PublicLayout