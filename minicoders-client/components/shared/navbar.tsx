
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Button } from '@/components/ui/button'
import Logo from '@/assets/logo'
import { ModeToggle } from './mode-toggle'
import { logout } from '@/services/logout'
import type { GetMeResponse } from '@/utils/types'

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

type NavbarProps = {
  user: GetMeResponse
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const profile = user.success ? user.data : null
  const role = profile?.role ?? null
  const displayName = profile?.kids?.name || profile?.name || ''
  const displayEmail = profile?.kids?.email || profile?.email || ''
  const dashboardHref =
    role === 'ADMIN'
      ? '/admin/dashboard'
      : role === 'SUPER_ADMIN'
        ? '/super-admin/dashboard'
        : '/dashboard'

  const handleLogout = async () => {
    if (isLoggingOut) return

    try {
      setIsLoggingOut(true)

      await logout()

      toast.success('User Logged Out Successfully!')

      setMobileOpen(false)

      window.location.replace('/login')
    } catch (error) {
      console.error('Logout failed:', error)

      toast.error('Failed to logout. Please try again.')

      setIsLoggingOut(false)
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
                      <SheetClose
                        key={item.href}
                        render={<Link href={item.href} />}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-muted font-bold text-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`}
                      >
                        {item.label}
                      </SheetClose>
                    )
                  })}
                </div>

                <div className="my-4 h-px bg-border" />

                {user.success ? (
                  <div className="flex flex-col gap-1 px-1">

                    <div className="px-3 py-1.5">
                      <p className="text-sm font-medium">
                        {displayName}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {displayEmail}
                      </p>
                    </div>

                    <SheetClose
                      render={<Link href={dashboardHref} />}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </SheetClose>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="size-4" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
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
                  className={`text-sm font-medium transition-colors ${
                    isActive
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
                      aria-label="Open user menu"
                      className="flex size-9 items-center justify-center rounded-full bg-muted transition-opacity hover:opacity-80"
                    />
                  }
                >
                  <User className="size-5" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">

                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {displayName}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {displayEmail}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    render={<Link href={dashboardHref} />}
                    className={`flex cursor-pointer items-center gap-2 ${
                      pathname.startsWith(dashboardHref)
                        ? 'font-medium'
                        : ''
                    }`}
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
                  >
                    <LogOut className="size-4" />
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
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
