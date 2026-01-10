import Integrations from '@/components/integrations-three'
import { AnimatedBeam } from '@/components/ui/animated-beam'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "Solutions",
    description: "Enterprise-grade RAG infrastructure solutions. Scalable, secure, and production-ready for your business needs.",
}

export default function SolutionPage() {
    return (
        <>
            <HeroHeader />
            <main className="pt-20">
                <div className="py-12 text-center">
                    <h1 className="text-4xl font-bold space-mono-regular mb-4">Enterprise Solutions</h1>
                    <p className="text-muted-foreground space-mono-regular max-w-2xl mx-auto px-4">
                        Scalable, secure, and production-ready RAG infrastructure for your business.
                    </p>
                </div>
                <AnimatedBeam />
                <Integrations />
            </main>
            <Footer />
        </>
    )
}
