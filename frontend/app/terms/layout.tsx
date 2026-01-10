import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for Krira Augment. Read about our usage policies and agreements.',
}

export default function TermsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
