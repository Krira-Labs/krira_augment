import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Krira Augment's mission to simplify RAG infrastructure for enterprise AI applications.",
}

export default function AboutPage() {
    return (
        <>
            <HeroHeader />
            <main className="pt-32 pb-20 px-6">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-6xl font-bold space-mono-regular mb-8">About Krira Augment</h1>
                    <p className="text-xl text-muted-foreground space-mono-regular mb-12">
                        We are building the infrastructure layer for the next generation of AI applications.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2 text-left mt-16">
                        <div className="p-8 border rounded-2xl bg-muted/30">
                            <h3 className="text-2xl font-bold space-mono-regular mb-4">Our Mission</h3>
                            <p className="text-muted-foreground space-mono-regular">
                                To simplify the complexity of RAG (Retrieval-Augmented Generation) pipelines, enabling developers to build production-grade AI apps in minutes, not months.
                            </p>
                        </div>
                        <div className="p-8 border rounded-2xl bg-muted/30">
                            <h3 className="text-2xl font-bold space-mono-regular mb-4">Our Vision</h3>
                            <p className="text-muted-foreground space-mono-regular">
                                A world where every software application can intelligently reason with proprietary data, securely and efficiently.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
