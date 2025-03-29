import { Button } from "@/Components/ui/button"
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Link, useForm } from "@inertiajs/react"
import {
    Alert,
    AlertDescription,
} from "@/Components/ui/alert"
import { Separator } from "@/Components/ui/separator"
import { InputPassword } from "@/Components/input-password"
import GuestLayout from '@/Layouts/GuestLayout';
import { LoaderCircle } from "lucide-react"

export default function Register() {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        last_name: '',
        first_name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleRegister = (e) => {
        e.preventDefault();
        clearErrors()
        post(route('register'));
    };

    return (
        <GuestLayout>
            <form onSubmit={handleRegister}>
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Please register an account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {(errors.email || errors.password) && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {errors.email || errors.password}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Last Name</Label>
                                <Input value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <Label>First Name</Label>
                                <Input value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} required />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>Email Address</Label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Password</Label>
                                <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                            </div>
                            <div className="space-y-1">
                                <Label>Confirm Password</Label>
                                <InputPassword value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full space-y-6">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Register
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
                            <CardDescription className="text-center">Already have an account?</CardDescription>
                            <Link href={route('login')} as="button" className="w-full">
                                <Button type="button" className="w-full" variant="outline">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardFooter>
            </form>
        </GuestLayout>
    );
}