import { InfiniteSlider } from '@/components/ui/infinite-slider'
import React from 'react'

const companies = [
    'OpenAI', 'Pinecone', 'KriraLabs', 'FastRouter', 'Modal', 'Cohere', 'Mistral'
]

export default function LogoCloud() {
    return (
        <div className="mx-auto mt-20 w-full max-w-5xl border-y border-border/10 py-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:gap-12">
                <span className="shrink-0 text-sm font-medium text-muted-foreground md:border-r md:border-border/10 md:pr-6">
                    Powered by best tech 
                </span>
                <div className="relative flex w-full flex-1 items-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
                    <InfiniteSlider speedOnHover={20} speed={40} gap={60}>
                        {companies.map((name) => (
                            <div key={name} className="flex items-center justify-center">
                                <span className="space-mono-regular text-lg font-bold text-muted-foreground/80 transition-colors duration-300 hover:text-foreground">
                                    {name}
                                </span>
                            </div>
                        ))}
                    </InfiniteSlider>
                </div>
            </div>
        </div>
    )
}
