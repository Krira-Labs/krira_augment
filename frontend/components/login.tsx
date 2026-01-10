"use client"
import { LogoIcon } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { authService } from '@/lib/api/auth.service'
import GoogleAuthButton from '@/components/GoogleAuthButton'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, FormEvent } from 'react'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const togglePasswordVisibility = () => setShowPassword(!showPassword)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password,
            })

            if (response.success && response.user) {
                toast({
                    title: "Success",
                    description: response.message,
                    variant: "success",
                })

                // Update auth context
                login(response.user)

                // Check for redirect path
                const redirectPath = sessionStorage.getItem('redirectAfterLogin')
                if (redirectPath) {
                    sessionStorage.removeItem('redirectAfterLogin')
                    router.push(redirectPath)
                } else {
                    router.push('/dashboard')
                }
            }
        } catch (error) {
            const description = error instanceof Error ? error.message : "Invalid credentials"
            toast({
                title: "Login Failed",
                description,
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
                className="bg-background relative z-10 w-full max-w-[400px] rounded-xl border border-border shadow-xl overflow-hidden">
                <div className="p-8">
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
                        <h1 className="mb-2 text-2xl font-bold space-mono-regular">Sign In to Krira</h1>
                        <p className="text-muted-foreground text-sm space-mono-regular">Welcome back! Sign in to continue</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <GoogleAuthButton mode="signin" />
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-medium tracking-wider">
                            <span className="bg-background px-3 text-muted-foreground space-mono-regular">Or continue with</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="block text-sm font-medium space-mono-regular">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                disabled={isLoading}
                                className="space-mono-regular shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium space-mono-regular">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className="pr-10 space-mono-regular shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all duration-200 hover:border-primary/50"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    asChild
                                    variant="link"
                                    size="sm"
                                    className="px-0 text-xs h-auto font-normal space-mono-regular text-muted-foreground hover:text-primary">
                                    <Link href="/forgotpassword">
                                        Forgot Password?
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-bold space-mono-regular mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </div>
                </div>

                <div className="bg-muted/50 border-t p-4 text-center">
                    <p className="text-sm text-muted-foreground space-mono-regular">
                        Do not have an account?{' '}
                        <Link href="/signup" className="text-primary font-bold hover:underline">
                            Create account
                        </Link>
                    </p>
                </div>
            </form>
        </section>
    )
}