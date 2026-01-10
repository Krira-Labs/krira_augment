import Features from '@/components/features-1'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Features",
    description: "Explore the powerful features of Krira Augment: High-performance RAG, Managed Infrastructure, and more.",
}

export default function FeaturesPage() {
    return (
        <>
            <HeroHeader />
            <main className="pt-20">
                <Features />
            </main>
            <Footer />
        </>
    )
}
