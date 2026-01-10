"use client"

import { HeroHeader } from "@/components/header"
import Footer from "@/components/footer"

export default function PrivacyPolicy() {
    return (
        <>
            <HeroHeader />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 space-mono-regular">
                            Privacy Policy
                        </h1>
                        <p className="text-muted-foreground space-mono-regular">
                            Last Updated: January 9, 2026
                        </p>
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">1. Introduction</h2>
                            <p className="leading-7">
                                Welcome to Krira Augment ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, the Krira Chunker library, and our managed RAG platform (collectively, the "Service").
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">2. Information We Collect</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium">2.1 Personal Information</h3>
                                <p>We may collect personal information that you voluntarily provide to us when you register for the Service, contact support, or subscribe to our newsletter. This includes:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Name and email address</li>
                                    <li>Billing information (processed by our payment providers)</li>
                                    <li>Account credentials</li>
                                </ul>

                                <h3 className="text-xl font-medium mt-6">2.2 Usage Data & Analytics</h3>
                                <p>When you use the managed platform or interact with our website, we automatically collect certain information:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Log data (IP address, browser type, pages visited)</li>
                                    <li>Performance metrics (throughput, error rates, API usage)</li>
                                    <li>Device information</li>
                                </ul>

                                <h3 className="text-xl font-medium mt-6">2.3 User Content</h3>
                                <p>
                                    "User Content" refers to the text, documents (PDF, CSV, etc.), and data you upload for processing via our chunking engine.
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-primary">Local Library Usage:</strong> If you use the open-source `krira-augment` Python library locally on your own infrastructure, <strong>we do not collect, view, or store your User Content.</strong> All processing happens on your machine.</li>
                                    <li><strong className="text-primary">Managed Platform Usage:</strong> If you use our hosted cloud platform, we process and store your User Content solely for the purpose of providing the Service (e.g., chunking, embedding, and storage). We do not use your User Content to train our foundation models without your explicit consent.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">3. How We Use Your Information</h2>
                            <p>We use the collected information for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide and maintain the Service</li>
                                <li>To process your payments and manage your account</li>
                                <li>To monitor usage and performance to improve the Krira engine (e.g., optimizing chunking algorithms)</li>
                                <li>To communicate with you regarding updates, security alerts, and support</li>
                                <li>To comply with legal obligations</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">4. Data Retention and Security</h2>
                            <p className="leading-7 mb-4">
                                We implement industry-standard security measures to protect your data, including encryption in transit and at rest. However, no method of transmission over the Internet is 100% secure.
                            </p>
                            <p className="leading-7">
                                We retain User Content only as long as necessary to provide the Service. You may delete your data from our managed platform at any time. Upon account termination, we will delete your data in accordance with our retention schedule, typically within 30 days.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">5. Third-Party Services</h2>
                            <p className="leading-7">
                                We may share data with trusted third-party service providers who assist us in operating the Service, such as:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Cloud hosting providers (e.g., AWS, GCP)</li>
                                <li>Payment processors (e.g., Stripe)</li>
                                <li>Analytics providers (e.g., PostHog, Google Analytics)</li>
                            </ul>
                            <p className="mt-4">
                                If you choose to integrate third-party Vector Databases (e.g., Pinecone, Qdrant) or LLM Providers (e.g., OpenAI), your data will be shared with them according to your configuration. Their privacy policies will govern that data usage.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">6. Children's Privacy</h2>
                            <p className="leading-7">
                                Our Service is not intended for individuals under the age of 13. We do not knowingly collect personal information from children.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">7. Changes to This Policy</h2>
                            <p className="leading-7">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">8. Contact Us</h2>
                            <p className="leading-7">
                                If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@kriraaugment.com" className="text-primary hover:underline">support@kriraaugment.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
