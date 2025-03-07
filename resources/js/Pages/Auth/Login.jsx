import { Button } from "@/Components/ui/button"
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import GuestLayout from "@/Layouts/GuestLayout"
import { Checkbox } from "@/components/ui/checkbox"
import { Link, useForm } from "@inertiajs/react"
import {
    Alert,
    AlertDescription,
} from "@/components/ui/alert"
import { InputPassword } from "@/Components/input-password"
import { Separator } from "@/Components/ui/separator"

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset, setError } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleLogin = (e) => {
        e.preventDefault();
        setError({ email: null })
        post(route('login'));
    };

    return (
        <GuestLayout>
            <form onSubmit={handleLogin}>
                <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Please login your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {status && (
                            <Alert>
                                <AlertDescription>
                                    {status}
                                </AlertDescription>
                            </Alert>
                        )}
                        {errors.email && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {errors.email}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-1">
                            <Label>Email Address</Label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label>Password</Label>
                            <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox checked={data.remember} onCheckedChange={(val) => setData('remember', val)} id="remember" />
                                <Label htmlFor="remember">Remember Me</Label>
                            </div>
                            {canResetPassword && (
                                <Link href={route('password.request')}>
                                    <Label>Forgot Password?</Label>
                                </Link>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full space-y-6">
                        <Button className="w-full" disabled={processing}>
                            Login
                        </Button>
                        <div className="flex gap-3 items-center justify-center">
                            <div className="w-full">
                                <Separator />
                            </div>
                            <Label>Or</Label>
                            <div className="w-full">
                                <Separator />
                            </div>
                        </div>
                        <div className="grid space-y-1">
                            <CardDescription className="text-center">Don't have an account?</CardDescription>
                            <Link href={route('register')} as="button" className="w-full">
                                <Button type="button" className="w-full" variant="outline">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </form>
        </GuestLayout>
    );
}
