import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
    {
        group: 'Product',
        items: [
            { title: 'Features', href: '/features' },
            { title: 'Pricing', href: '/pricing' },
            { title: 'Documentation', href: '/docs' },
            // { title: 'API Reference', href: '/api-reference' },
        ],
    },
    {
        group: 'Resources',
        items: [
            // { title: 'Blog', href: '/blogs' },
            // { title: 'Community', href: '#' },
            { title: 'Contact', href: '/contact' },
        ],
    },
    {
        group: 'Legal',
        items: [
            { title: 'Privacy', href: '/privacy' },
            { title: 'Terms', href: '/terms' },
        ],
    },
]

export default function FooterSection() {
    return (
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-background pt-16 pb-8">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-12 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="block size-fit mb-4">
                            <Logo />
                        </Link>
                        <p className="text-sm text-muted-foreground space-mono-regular">Enterprise-grade RAG Infrastructure.</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-3">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-4 text-sm">
                                <span className="block font-bold text-foreground space-mono-regular">{link.group}</span>
                                {link.items.map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className="text-muted-foreground hover:text-primary block transition-colors duration-200 space-mono-regular">
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex justify-center flex-col md:flex-row items-center justify-between gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
                    <span className="text-muted-foreground text-xs md:text-sm space-mono-regular text-center md:text-left">
                        Copyright © 2025 Krira Labs. All rights reserved.
                    </span>

                </div>
            </div>
        </footer>
    )
}
