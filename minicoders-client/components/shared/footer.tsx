import Link from 'next/link'
import { Mail } from 'lucide-react'

const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
]

const learnLinks = [
    { label: 'Problems', href: '/problems' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
]

const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
]

export function Footer() {

    return (
        <footer className="border-t">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold">
                            MiniCoders
                        </Link>
                        <p className="max-w-xs text-sm text-muted-foreground">
                            A fun place for kids to learn coding by solving
                            problems, earning points and growing every day.
                        </p>
                        <a
                            href="mailto:support@minicoders.com"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Mail className="size-4" />
                            support@minicoders.com
                        </a>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Learn</h3>
                        <ul className="space-y-3">
                            {learnLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Legal</h3>
                        <ul className="space-y-3">
                            {legalLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
                    © 2026 MiniCoders. All rights reserved.
                </div>
            </div>
        </footer>
    )
}