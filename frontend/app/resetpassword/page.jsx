"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { authService } from "@/lib/api/auth.service"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react"

const ResetPasswordForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const { login } = useAuth()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [resetToken, setResetToken] = useState("")

    useEffect(() => {
        // Get token from URL (assuming format: /resetpassword?token=xxx)
        const token = searchParams.get('token')
        if (token) {
            setResetToken(token)
        } else {
            // Check if token is in the path (format: /resetpassword/:token)
            const pathToken = window.location.pathname.split('/').pop()
            if (pathToken && pathToken !== 'resetpassword') {
                setResetToken(pathToken)
            } else {
                toast({
                    title: "Error",
                    description: "Invalid or missing reset token",
                    variant: "destructive",
                })
                router.push('/forgotpassword')
            }
        }
    }, [searchParams, router, toast])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            })
            return
        }

        if (password.length < 8) {
            toast({
                title: "Weak Password",
                description: "Password must be at least 8 characters long",
                variant: "destructive",
            })
            return
        }

        if (!resetToken) {
            toast({
                title: "Error",
                description: "Invalid reset token",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await authService.resetPassword(resetToken, { password })

            if (response.success && response.user) {
                toast({
                    title: "Success",
                    description: response.message,
                    variant: "success",
                })

                // Update auth context (backend logs in user after reset)
                login(response.user)

                // Redirect to dashboard
                router.push('/dashboard')
            }
        } catch (error) {
            toast({
                title: "Reset Failed",
                description: error.message || "Failed to reset password",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const passwordsMatch = !password || !confirmPassword || password === confirmPassword

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
                        <h1 className="mb-2 text-2xl font-bold space-mono-regular">Reset Password</h1>
                        <p className="text-muted-foreground text-sm space-mono-regular">Create a new password for your account.</p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="password" className="space-mono-regular">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Enter your new password"
                                    className="pr-10 space-mono-regular shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="space-mono-regular">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder="Confirm your password"
                                    className="pr-10 space-mono-regular shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground">
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {!passwordsMatch && (
                            <p className="text-sm text-destructive space-mono-regular">Passwords do not match.</p>
                        )}

                        <Button type="submit" className="w-full font-bold space-mono-regular" disabled={!passwordsMatch || !password || !confirmPassword || isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update password'
                            )}
                        </Button>
                    </div>
                </div>

                <div className="bg-muted/50 border-t p-4 text-center">
                    <p className="text-sm text-muted-foreground space-mono-regular">
                        Remembered your password?{' '}
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </section>
    )
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}