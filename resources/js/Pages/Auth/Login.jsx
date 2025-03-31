import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import GuestLayout from "@/Layouts/GuestLayout"
import { Checkbox } from "@/Components/ui/checkbox"
import { Link, useForm } from "@inertiajs/react"
import {
    Alert,
    AlertDescription,
} from "@/Components/ui/alert"
import { InputPassword } from "@/Components/input-password"
import { LoaderCircle } from "lucide-react"
import InputError from "@/Components/input-error"

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleLogin = (e) => {
        e.preventDefault();
        clearErrors()
        post(route('login'));
    };

    return (
        <GuestLayout title="Log in to your account" description="Enter your email and password below to log in.">
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                    {status && (
                        <Alert className="border-primary">
                            <AlertDescription className="text-primary">
                                {status}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-1">
                        <Label>Email address</Label>
                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        <InputError message={errors.email} />
                    </div>
                    <div className="space-y-1">
                        <Label>Password</Label>
                        <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <InputError message={errors.password} />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox checked={data.remember} onCheckedChange={(val) => setData('remember', val)} id="remember" />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>
                        {canResetPassword && (
                            <Link href={route('password.request')}>
                                <Label>Forgot password?</Label>
                            </Link>
                        )}
                    </div>
                </div>
                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Log in
                </Button>
                <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="hover:underline">
                        Register
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
