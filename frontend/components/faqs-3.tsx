'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

type FAQItem = {
    id: string
    question: string
    answer: string
}

export default function FAQSection() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            question: 'What makes Krira different from other RAG providers?',
            answer: 'Krira provides end-to-end managed infrastructure specifically designed for scaling RAG applications. Unlike generic vector DBs or raw model APIs, we handle the complex orchestration, chunking strategies, and retrieval optimization, allowing you to focus on building your product.',
        },
        {
            id: 'item-2',
            question: 'Can I use my own vector database and models?',
            answer: 'Yes. While we offer a fully managed internal vector store and embedding models for convenience, our "Starter" and "Enterprise" plans allow you to bring your own providers (like Pinecone, Chroma, OpenAI, Anthropic) while still leveraging our orchestration layer.',
        },
        {
            id: 'item-3',
            question: 'How is data security handled?',
            answer: 'Security is a top priority. We use enterprise-grade encryption for data at rest and in transit. For our Enterprise customers, we offer advanced features like private VPC deployment and custom data retention policies to meet compliance requirements.',
        },
        {
            id: 'item-4',
            question: 'What happens if I exceed my plan limits?',
            answer: 'If you approach your plan limits, we will notify you via email. For "Free" plans, access may be paused until the next billing cycle. "Starter" and "Enterprise" plans have soft limits with the option to purchase additional on-demand credits to ensure uninterrupted service.',
        },
        {
            id: 'item-5',
            question: 'Do you offer technical support for integration?',
            answer: 'Absolutely. All plans include access to our comprehensive documentation and community forums. Paid plans receive priority email support, and Enterprise customers get a dedicated success manager to assist with architectural reviews and integration.',
        },
    ]

    return (
        <section className="py-20 md:py-32 border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-20">
                    <div className="md:w-1/3">
                        <div className="sticky top-24">
                            <h2 className="text-3xl font-bold space-mono-regular leading-tight lg:text-4xl">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4 space-mono-regular">
                                Have more questions? Reach out to our{' '}
                                <Link
                                    href="mailto:support@krira.ai"
                                    className="text-primary font-bold hover:underline">
                                    support team
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-4">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="border-b border-zinc-200 dark:border-zinc-800 last:border-0 px-0"
                                >
                                    <AccordionTrigger className="cursor-pointer py-6 hover:no-underline hover:text-primary transition-colors text-left">
                                        <span className="text-lg font-medium space-mono-regular">{item.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6">
                                        <div className="pr-4">
                                            <p className="text-base text-muted-foreground leading-relaxed space-mono-regular">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
