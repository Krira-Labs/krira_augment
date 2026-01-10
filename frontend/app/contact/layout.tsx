import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the Krira Augment team. We are here to help you with your RAG pipeline questions.',
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
