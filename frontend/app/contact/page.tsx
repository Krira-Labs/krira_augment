"use client"

import { useState } from "react"
import { HeroHeader } from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MessageSquare, User, Send, CheckCircle2, Loader2 } from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({ name: "", email: "", message: "" })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <>
            <HeroHeader />
            <main className="min-h-screen pt-24 pb-16">
                <div className="mx-auto max-w-6xl px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 space-mono-regular">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto space-mono-regular">
                            Have questions about Krira? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle className="text-2xl space-mono-regular">Send a Message</CardTitle>
                                <CardDescription className="space-mono-regular">
                                    Fill out the form below and our team will get back to you within 24 hours.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isSubmitted ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4 mb-4">
                                            <CheckCircle2 className="size-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 space-mono-regular">Message Sent!</h3>
                                        <p className="text-muted-foreground mb-6 space-mono-regular">
                                            Thank you for reaching out. We'll be in touch soon.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsSubmitted(false)}
                                            className="space-mono-regular"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="space-mono-regular">Name</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    placeholder="Your name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="pl-12 space-mono-regular"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="space-mono-regular">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground/50" />
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="pl-12 space-mono-regular"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="space-mono-regular">Message</Label>
                                            <div className="relative">
                                                <MessageSquare className="absolute left-3 top-3 size-5 text-muted-foreground/50" />
                                                <Textarea
                                                    id="message"
                                                    name="message"
                                                    placeholder="How can we help you?"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows={5}
                                                    className="pl-12 resize-none space-mono-regular"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full space-mono-regular font-bold"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 size-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6 space-mono-regular">Other Ways to Reach Us</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-lg bg-primary/10 p-3">
                                            <Mail className="size-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1 space-mono-regular">Email</h3>
                                            <p className="text-muted-foreground space-mono-regular">support@kriraaugment.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border bg-muted/30 p-6">
                                <h3 className="font-semibold mb-3 space-mono-regular">Quick Response Times</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground space-mono-regular">
                                    <li className="flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-green-500" />
                                        General inquiries: Within 24 hours
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-blue-500" />
                                        Technical support: Within 12 hours
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="size-1.5 rounded-full bg-purple-500" />
                                        Enterprise: Priority response
                                    </li>
                                </ul>
                            </div>

                            <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
                                <h3 className="font-semibold mb-2 space-mono-regular">Enterprise Solutions</h3>
                                <p className="text-sm text-muted-foreground mb-4 space-mono-regular">
                                    Need custom solutions or dedicated support? Contact our enterprise team for tailored pricing and features.
                                </p>
                                <Button variant="outline" className="space-mono-regular">
                                    Contact Enterprise Sales
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
