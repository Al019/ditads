import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSend = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <form onSubmit={handleSend}>
                <CardHeader>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>Forgot your password? No problem. Just let us know your email
                        address and we will email you a password reset link that will
                        allow you to choose a new one.</CardDescription>
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
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={processing}>
                        Email Password Reset Link
                    </Button>
                </CardFooter>
            </form>
        </GuestLayout>
    );
}
