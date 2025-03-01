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

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset, setError } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleLogin = (e) => {
        e.preventDefault();
        setError({ email: null })
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <form onSubmit={handleLogin}>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
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
                    <Button className="w-full" disabled={processing}>
                        Sign In
                    </Button>
                </CardFooter>
            </form>
        </GuestLayout>
    );
}
