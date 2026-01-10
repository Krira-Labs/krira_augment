
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Cpu, Scissors, Search } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl space-mono-regular">Enterprise-Grade Infrastructure</h2>
                    <p className="mt-4 text-muted-foreground space-mono-regular max-w-2xl mx-auto">
                        Everything you need to build, scale, and optimize your production RAG pipelines with precision.
                    </p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-12 grid max-w-sm gap-6 *:text-center md:max-w-none md:grid-cols-3 md:mt-16">
                    <Card className="group shadow-zinc-950/5 hover:shadow-zinc-950/10 dark:hover:shadow-white/5 transition-all duration-300 border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Scissors
                                    className="size-6 text-foreground"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-bold space-mono-regular text-lg">High Performance Chunking</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Advanced splitting strategies with automated data cleaning to preserve meaningful context at scale.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5 hover:shadow-zinc-950/10 dark:hover:shadow-white/5 transition-all duration-300 border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Cpu
                                    className="size-6 text-foreground"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-bold space-mono-regular text-lg">GPU-Accelerated Embeddings</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                Lightning-fast vector generation with native GPU support for high-throughput embedding processing.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5 hover:shadow-zinc-950/10 dark:hover:shadow-white/5 transition-all duration-300 border-zinc-200 dark:border-zinc-800">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Search
                                    className="size-6 text-foreground"
                                    aria-hidden
                                />
                            </CardDecorator>

                            <h3 className="mt-6 font-bold space-mono-regular text-lg">High Level Retrieval</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                State-of-the-art retrieval algorithms optimized for semantic accuracy, speed, and relevance ranking.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
        />

        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)
