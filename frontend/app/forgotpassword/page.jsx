"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "@/lib/api/auth.service"
import Link from "next/link"
import Image from "next/image"
import { Loader2, ArrowLeft } from "lucide-react"
import { useState } from "react"

export default function ForgotPassword() {
    const { toast } = useToast()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const response = await authService.forgotPassword({ email })

            if (response.success) {
                toast({
                    title: "Success",
                    description: response.message,
                    variant: "success",
                })

                // Note: The backend sends email with reset link
                // You might want to redirect to a confirmation page
                toast({
                    title: "Check Your Email",
                    description: "We've sent you a password reset link. Please check your email.",
                    variant: "success",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to send reset email",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16 md:py-18 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

            {/* Back Button */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="size-5" />
                <span className="space-mono-regular text-sm font-medium">Back</span>
            </Link>

            <form
                onSubmit={handleSubmit}
                className="bg-background relative z-10 w-full max-w-[400px] rounded-xl border border-border shadow-xl overflow-hidden text-left">
                <div className="p-8 pb-6">
                    <div className="mb-8">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="inline-block mb-6">
                            <Image
                                src="/krira-augment-logo3.jpeg"
                                alt="Krira Logo"
                                width={60}
                                height={60}
                                className="rounded-lg"
                            />
                        </Link>
                        <h1 className="mb-2 text-2xl font-bold space-mono-regular">Forgot Password</h1>
                        <p className="text-muted-foreground text-sm space-mono-regular">
                            Enter the email linked with your account and we&apos;ll send you a reset link.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="space-mono-regular">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                className="space-mono-regular shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                            />
                        </div>

                        <Button type="submit" className="w-full font-bold space-mono-regular" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send reset link'
                            )}
                        </Button>
                    </div>
                </div>

                <div className="bg-muted/50 border-t p-4 text-center">
                    <p className="text-sm text-muted-foreground space-mono-regular">
                        Remember your password?{' '}
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Back to sign in
                        </Link>
                    </p>
                </div>
            </form>
        </section>
    )
}