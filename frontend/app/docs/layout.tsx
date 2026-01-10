import type { Metadata } from "next"
import { HeroHeader } from "@/components/header"
import Footer from "@/components/footer"
import { DocsSidebar } from "@/components/docs-sidebar"

export const metadata: Metadata = {
    title: "Documentation",
    description: "Technical documentation for Krira Augment - Installation, Usage, and Integration Guides.",
}

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <HeroHeader />
            <div className="flex flex-1 pt-16">
                <DocsSidebar />
                <main className="flex-1 md:ml-64 lg:ml-72">
                    <div className="container max-w-4xl py-10 px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
            <div className="md:ml-64 lg:ml-72">
                <Footer />
            </div>
        </div>
    )
}
