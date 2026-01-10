"use client"

import { HeroHeader } from "@/components/header"
import Footer from "@/components/footer"

export default function TermsOfService() {
    return (
        <>
            <HeroHeader />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 space-mono-regular">
                            Terms of Service
                        </h1>
                        <p className="text-muted-foreground space-mono-regular">
                            Last Updated: January 9, 2026
                        </p>
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">1. Acceptance of Terms</h2>
                            <p className="leading-7">
                                By accessing or using the Krira Augment website, the Krira Chunker library, or our managed services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">2. Description of Service</h2>
                            <p className="leading-7">
                                Krira Augment provides a high-performance chunking engine and infrastructure for RAG (Retrieval Augmented Generation) pipelines. The Service includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>An open-source Python library (`krira-augment`) for local processing.</li>
                                <li>A hosted managed platform for processing, storing, and retrieving data chunks.</li>
                                <li>API access and developer tools.</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Beta Notice:</strong> Portions of the Service are currently in "Beta". They may contain bugs, errors, or incompleteness. We make no guarantees regarding uptime or stability for Beta features.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">3. User Accounts and Responsibilities</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Registration:</strong> You must provide accurate and complete information when creating an account.</li>
                                <li><strong>Security:</strong> You are responsible for maintaining the confidentiality of your account credentials and API keys. You are fully responsible for all activities that occur under your account.</li>
                                <li><strong>Usage Restrictions:</strong> You agree not to use the Service for any illegal purpose, to violate any laws, or to infringe on the intellectual property rights of others. You may not reverse engineer, decompile, or attempt to extract the source code of the managed platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">4. Intellectual Property</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium">4.1 Krira IP</h3>
                                <p>
                                    The Service, including its "Krira" name, logo, code, and underlying technology, is the property of Krira Labs and is protected by copyright and other intellectual property laws.
                                </p>

                                <h3 className="text-xl font-medium">4.2 User Content</h3>
                                <p>
                                    You retain full ownership of the data, files, and text you process using the Service ("User Content"). You grant Krira a limited, non-exclusive license to process, store, and display your User Content solely as necessary to provide the Service to you. We claim no ownership over your RAG outputs.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">5. Fees and Payment</h2>
                            <p className="leading-7">
                                Certain features of the Service are available only with a paid subscription. If you choose a paid plan (Starter, Enterprise), you agree to pay the applicable fees.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-2">
                                <li>Fees are non-refundable except as required by law.</li>
                                <li>We reserve the right to change our pricing upon notice to you.</li>
                                <li>Failure to pay may result in the suspension or termination of your account.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">6. Limitation of Liability</h2>
                            <p className="leading-7">
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, KRIRA LABS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; OR (B) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND/OR ANY PERSONAL INFORMATION STORED THEREIN.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">7. Termination</h2>
                            <p className="leading-7">
                                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">8. Governing Law</h2>
                            <p className="leading-7">
                                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4 space-mono-regular">9. Contact Us</h2>
                            <p className="leading-7">
                                If you have any questions about these Terms, please contact us at: <a href="mailto:support@kriraaugment.com" className="text-primary hover:underline">support@kriraaugment.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
