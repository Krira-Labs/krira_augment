"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Database, Cpu, Sparkles, Zap, Shield, Clock, ExternalLink, Bot, Brain, Layers, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import HeroHeader from "./hero-section";
import LogoCloud from "./logo-cloud";
import Features from "./features-1";
import Integrations from "./integrations-three";
import { AnimatedBeam } from "./ui/animated-beam";
import Pricing from "./pricing";
import FAQSection from "./faqs-3";
import Footer from "./footer";
import { motion } from "framer-motion";
import ParticleText from "./particle-text";
import { BorderBeam } from "@/components/ui/border-beam";



export default function HomePage() {
  return (
    <>
      <HeroHeader />
      <LogoCloud />
      <Features />
      <Integrations />

      <AnimatedBeam />
      <Pricing />
      <FAQSection />
      <Footer />
    </>
  );
}