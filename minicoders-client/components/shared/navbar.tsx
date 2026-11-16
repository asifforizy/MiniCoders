'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut, Menu, User } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'
import { logout } from '@/services/logout'
import Logo from '@/assets/logo'
import { ModeToggle } from './mode-toggle'

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Games', href: '/games' },
    { label: 'Problems', href: '/problems' },
    { label: 'Contest', href: '/contest' },
    { label: 'Rankings', href: '/rankings' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
]

type IUser = {
  success: boolean
  message: string
  data: {
    id: string
    name: string
    email: string
    role: string
    status: string
    imageUrl: string
    emailVerified: boolean
    registerUser?: {
      contactNumber: string
      address: string | null
    }
  }
}

type NavbarProps = {
  user: IUser
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('User Logged Out Successfully!')
      setMobileOpen(false)
      router.push('/login')
      router.refresh()
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* LEFT: mobile menu + logo */}
          <div className="flex flex-1 items-center gap-2">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-md hover:bg-muted md:hidden"
                    aria-label="Open menu"
                  />
                }
              >
                <Menu className="size-5" />
              </SheetTrigger>

              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 text-xl font-bold"
                    >
                      <Logo className="h-6 w-auto text-[#3902FF] dark:text-[#7B5CFF]" />
                      MiniCoders
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col gap-1 px-1">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href)

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                            ? 'bg-muted font-bold text-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>

                <div className="my-4 h-px bg-border" />

                {user.success ? (
                  <div className="flex flex-col gap-1 px-1">
                    <div className="px-3 py-1.5">
                      <p className="text-sm font-medium">
                        {user.data.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.data.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-1">
                    <Button
                      className="w-full cursor-pointer"
                      nativeButton={false}
                      render={
                        <Link
                          href="/login"
                          onClick={() => setMobileOpen(false)}
                        />
                      }
                    >
                      Login
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold"
            >
              <Logo className="h-7 w-auto text-[#3902FF] dark:text-[#7B5CFF]" />
              MiniCoders
            </Link>
          </div>

          {/* CENTER: desktop links */}
          <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${isActive
                      ? 'font-bold text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* RIGHT: theme toggle + user menu / login */}
          <div className="flex flex-1 items-center justify-end gap-5">
            <ModeToggle />

            {user.success ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      className="flex size-9 items-center justify-center rounded-full bg-muted transition-opacity hover:opacity-80"
                    />
                  }
                >
                  <User className="size-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user.data.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.data.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    render={<Link href="/dashboard" />}
                    className={`flex cursor-pointer items-center gap-2 ${pathname.startsWith('/dashboard') ? 'font-medium' : ''
                      }`}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="cursor-pointer"
                nativeButton={false}
                render={<Link href="/login" />}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}