"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Database, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { HeroHeader } from "./header";
import LogoCloud from "./logo-cloud";
import Features from "./features-1";
import { AnimatedBeam } from "./ui/animated-beam";
import Pricing from "./pricing";
import FAQSection from "./faqs-3";
import Footer from "./footer";
import { motion } from "framer-motion";
import ParticleText from "./particle-text";
import { BorderBeam } from "@/components/ui/border-beam";

const IntegrationShowcase: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const knowledgeRef = React.useRef<HTMLDivElement | null>(null)
  const embeddingRef = React.useRef<HTMLDivElement | null>(null)
  const llmRef = React.useRef<HTMLDivElement | null>(null)
  const analyticsRef = React.useRef<HTMLDivElement | null>(null)

  const beamConfig = [
    {
      from: knowledgeRef,
      to: embeddingRef,
      curvature: 80,
      gradientStartColor: "#38bdf8",
      gradientStopColor: "#6366f1",
      pathColor: "#93c5fd",
      delay: 0.3,
    },
    {
      from: embeddingRef,
      to: llmRef,
      curvature: 60,
      gradientStartColor: "#a855f7",
      gradientStopColor: "#ec4899",
      pathColor: "#f0abfc",
      delay: 0.6,
    },
    {
      from: llmRef,
      to: analyticsRef,
      curvature: 70,
      gradientStartColor: "#22d3ee",
      gradientStopColor: "#14b8a6",
      pathColor: "#67e8f9",
      delay: 0.9,
      reverse: true,
    },
  ]

  return (
    <div
      ref={containerRef}
      className="relative grid gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-900/20 p-6 shadow-2xl backdrop-blur"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div
          ref={knowledgeRef}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white"
        >
          <p className="text-xs uppercase tracking-widest text-slate-300">Knowledge graph</p>
          <p className="mt-2 text-2xl font-semibold">Docs, SQL, Notion</p>
          <p className="mt-2 text-sm text-slate-300">
            Unified ingestion with automatic chunking and metadata enrichment.
          </p>
        </div>
        <div
          ref={embeddingRef}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-white"
        >
          <p className="text-xs uppercase tracking-widest text-slate-400">Vector DB</p>
          <p className="mt-2 text-2xl font-semibold">Pinecone · Chroma</p>
          <p className="mt-2 text-sm text-slate-300">
            Managed embeddings with auto-scaling dimensions per provider.
          </p>
        </div>
        <div
          ref={llmRef}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-600/50 to-purple-500/40 p-4 text-white"
        >
          <p className="text-xs uppercase tracking-widest text-white/80">LLM Orchestration</p>
          <p className="mt-2 text-2xl font-semibold">GPT·Claude·Gemini</p>
          <p className="mt-2 text-sm text-white/80">
            Deterministic routing across providers with latency-aware fallbacks.
          </p>
        </div>
        <div
          ref={analyticsRef}
          className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white"
        >
          <p className="text-xs uppercase tracking-widest text-slate-200">Analytics</p>
          <p className="mt-2 text-2xl font-semibold">Realtime Insights</p>
          <div className="mt-3 space-y-1 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Latency</span>
              <span>215 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Accuracy</span>
              <span>94%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cost</span>
              <span>$0.004/query</span>
            </div>
          </div>
        </div>
      </div>

      {beamConfig.map((beam, index) => (
        <AnimatedBeam
          key={`beam-${index}`}
          containerRef={containerRef}
          fromRef={beam.from}
          toRef={beam.to}
          curvature={beam.curvature}
          pathColor={beam.pathColor}
          pathOpacity={0.35}
          gradientStartColor={beam.gradientStartColor}
          gradientStopColor={beam.gradientStopColor}
          delay={beam.delay}
          duration={6}
          reverse={beam.reverse}
          startYOffset={-10}
          endYOffset={-10}
        />
      ))}
    </div>
  )
}


const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HomePage() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        {/* Smoke/Nebula Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-l from-blue-600/10 via-purple-500/5 to-transparent blur-[120px] animate-pulse" />
          <div
            className="absolute top-0 right-0 h-full w-full opacity-30"
            style={{
              background: 'radial-gradient(circle at 100% 50%, rgba(59, 130, 246, 0.1), transparent 60%)',
            }}
          />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 min-h-[90vh] flex flex-col justify-center py-20">
          <div className="mx-auto max-w-7xl px-6 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left relative z-20">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="group inline-flex items-center gap-2 rounded-full border border-black/5 bg-gray-50/50 p-1 pl-4 pr-1 shadow-sm backdrop-blur-sm transition-colors hover:bg-gray-100/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 mb-8"
                  >
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      Now supporting GPT 5.1 & Claude 4.5 Sonnet
                    </span>
                    <span className="h-4 w-[1px] bg-black/10 dark:bg-white/10"></span>
                    <div className="flex size-6 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:translate-x-0.5 dark:bg-white/10">
                      <ArrowRight className="size-3 text-black dark:text-white" />
                    </div>
                  </Link>

                  <h1 className="font-montserrat font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-tight mb-6 pb-2">
                    <span
                      className="inline-block pr-4 font-bold drop-shadow-sm dark:drop-shadow-[0_0_30px_rgba(155,153,254,0.4)] text-[#4338ca] dark:text-[#9b99fe]"
                      style={{
                        letterSpacing: '0.07em'
                      }}
                    >
                      KRIRA
                    </span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 dark:from-blue-400 dark:via-blue-200 dark:to-blue-400 animate-pulse inline-block font-medium tracking-tighter">
                      AUGMENT
                    </span>
                  </h1>

                  <div className="mt-6 flex flex-col items-center lg:items-start gap-4">
                    <div className="relative rounded-xl border border-blue-500/20 bg-blue-500/5 px-6 py-3 overflow-hidden w-fit">
                      <BorderBeam size={100} duration={12} delay={9} />
                      <TextEffect
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        as="span"
                        className="text-primary font-semibold text-xl relative z-10"
                      >
                        Production-Ready RAG in Minutes.
                      </TextEffect>
                    </div>

                    <TextEffect
                      preset="fade-in-blur"
                      speedSegment={0.3}
                      as="p"
                      className="max-w-2xl text-xl text-gray-600 dark:text-gray-400 leading-relaxed lg:mx-0 mx-auto"
                      delay={1.5}
                    >
                      Automate chunking, embeddings, and retrieval with zero configuration.
                    </TextEffect>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                    <div className="rounded-[calc(var(--radius-xl)+0.125rem)] border border-black/10 dark:border-white/10 p-0.5 shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-xl px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-semibold"
                      >
                        <Link href="#link">
                          Start Building
                        </Link>
                      </Button>
                    </div>
                    <Button
                      asChild
                      size="lg"
                      variant="ghost"
                      className="h-14 rounded-xl px-8 text-lg text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      <Link href="#link">
                        Book a Demo
                      </Link>
                    </Button>
                  </div>
                </AnimatedGroup>
              </div>

              {/* Right Content - Visuals */}
              <div className="relative h-[500px] hidden lg:flex items-center justify-center perspective-1000">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-full h-full"
                >
                  <ParticleText />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo Cloud Section */}
        <section className="bg-white dark:bg-black py-6 md:py-10 lg:py-12 border-t border-black/5 dark:border-white/5">
          <div className="group relative m-auto max-w-5xl px-6 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <LogoCloud />
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-background py-12 md:py-16 lg:py-20">
          <div className="m-auto max-w-6xl px-6">
            <Features />
          </div>
        </section>

        {/* Integrations Section */}
        <section className="bg-background py-8 md:py-12 lg:py-16">
          <div className="m-auto max-w-6xl px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Integrations</p>
                <h2 className="text-4xl font-bold leading-tight">
                  Connect every knowledge stream to a single production RAG pipeline.
                </h2>
                <p className="text-lg text-muted-foreground">
                  Krira orchestrates ingestion, embeddings, vector databases, and LLM routing with one-click deployments.
                  Visualize the entire flywheel below.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Source anything</p>
                      <p className="text-muted-foreground text-sm">Sync docs, tickets, and databases with automatic schema detection.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Adaptive compute</p>
                      <p className="text-muted-foreground text-sm">Smart routing keeps latency low while honoring cost ceilings.</p>
                    </div>
                  </div>
                </div>
              </div>
              <IntegrationShowcase />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-background py-8 md:py-12 lg:py-16">
          <div className="m-auto max-w-6xl px-6">
            <Pricing />
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-background py-8 md:py-12 lg:py-16">
          <div className="m-auto max-w-6xl px-6">
            <FAQSection />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background pt-16 md:pt-20">
          <Footer />
        </footer>
      </main>
    </>
  );
}