import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const handleSend = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <form onSubmit={handleSend}>
                <CardHeader>
                    <CardTitle>Verify Email</CardTitle>
                    <CardDescription>Thanks for signing up! Before getting started, could you verify
                        your email address by clicking on the link we just emailed to
                        you? If you didn't receive the email, we will gladly send you
                        another.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {status === 'verification-link-sent' && (
                            <Alert>
                                <AlertDescription>
                                    A new verification link has been sent to the email address
                                    you provided during registration.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="w-full space-y-6">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            Resend Verification Email
                        </Button>
                        <Link href={route('logout')} method="post" as="button" className="w-full">
                            <Button className="w-full" variant="outline">
                                Logout
                            </Button>
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </GuestLayout>
    );
}