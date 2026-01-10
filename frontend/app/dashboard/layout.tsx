import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Manage your RAG pipelines, view analytics, and configure your settings.',
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
