'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Settings, LogOut, UserCircle } from 'lucide-react'
import { toast } from 'sonner'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { logout } from '@/services/logout'


const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
]

const userMenuItems = [
    { label: 'Profile', href: '/profile', icon: UserCircle },
    { label: 'Settings', href: '/settings', icon: Settings },
]

export type AppUser = {
    id: string
    name: string
    email: string
    password?: string | null
    googleId?: string | null
    authProvider: 'CREDENTIAL' | 'GOOGLE'
    emailVerified: boolean
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    status: 'ACTIVE' | 'BLOCKED' | 'DELETED'
    needPasswordChange: boolean
    imageUrl: string
    imagePublicId: string
    isDeleted: boolean
    deletedAt: string | null
    createdAt: string
    updatedAt: string
}

export type IUserResponse = {
    success: boolean
    message: string
    data: AppUser
}

type NavbarProps = {
    user: IUserResponse
}

export function Navbar({ user }: NavbarProps) {
    const router = useRouter()
    const currentUser = user?.data

    const handleLogout = async () => {
        try {
            await logout()
            toast.success('User Logged Out Successfully!')
            router.push('/login')
            router.refresh()
        } catch {
            toast.error('Failed to logout. Please try again.')
        }
    }

    const getInitials = (name: string) =>
        name
            .trim()
            .split(/\s+/)
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U'

    const hasAvatar = Boolean(currentUser?.imageUrl?.trim())

    return (
        <nav className="border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center">
                    <div className="flex-1">
                        <Link href="/" className="text-2xl font-bold">
                            MiniCoders
                        </Link>
                    </div>

                    <div className="hidden md:flex justify-center gap-8 flex-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex-1 flex justify-end">
                        {user.success && currentUser ? (
                            <DropdownMenu>
                                {/* ✅ Base UI: use `render` instead of `asChild` */}
                                <DropdownMenuTrigger
                                    render={
                                        <button
                                            type="button"
                                            aria-label="Open user menu"
                                            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        />
                                    }
                                >
                                    <div className="size-9 rounded-full overflow-hidden flex items-center justify-center bg-muted ring-1 ring-border cursor-pointer hover:opacity-80 transition-opacity">
                                        {hasAvatar ? (
                                            <Image
                                                src={currentUser.imageUrl}
                                                alt={currentUser.name}
                                                width={36}
                                                height={36}
                                                className="size-9 object-cover"
                                            />
                                        ) : (
                                            <span className="text-xs font-semibold text-muted-foreground">
                                                {getInitials(currentUser.name)}
                                            </span>
                                        )}
                                    </div>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-2 py-1.5">
                                        <p className="text-sm font-medium truncate">
                                            {currentUser.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {currentUser.email}
                                        </p>
                                        {currentUser.role !== 'USER' && (
                                            <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                                                {currentUser.role}
                                            </span>
                                        )}
                                    </div>

                                    <DropdownMenuSeparator />

                                    {/* ✅ Base UI: DropdownMenuItem has no `render`/`asChild`.
                                        Use onClick + router.push for navigation. */}
                                    {userMenuItems.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <DropdownMenuItem
                                                key={item.href}
                                                onClick={() => router.push(item.href)}
                                                className="cursor-pointer flex items-center gap-2"
                                            >
                                                <Icon className="size-4" />
                                                {item.label}
                                            </DropdownMenuItem>
                                        )
                                    })}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-600 focus:text-red-600 flex items-center gap-2 cursor-pointer"
                                    >
                                        <LogOut className="size-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button className="cursor-pointer">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}