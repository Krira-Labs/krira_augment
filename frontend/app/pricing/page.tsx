import Pricing from '@/components/pricing'
import PricingComparator from '@/components/pricing-comparator-one'
import { HeroHeader } from '@/components/header'
import Footer from '@/components/footer'
import { Metadata } from 'next'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
    title: "Pricing",
    description: "Flexible pricing plans for Krira Augment. Choose the right plan for your team and scale your RAG infrastructure.",
}

export default function PricingPage() {
    return (
        <>
            <HeroHeader />
            <main className="pt-20">
                <Pricing />
                <PricingComparator />
                <div className="mx-auto max-w-6xl px-6">
                    <Separator className="my-12" />
                </div>
            </main>
            <Footer />
        </>
    )
}
