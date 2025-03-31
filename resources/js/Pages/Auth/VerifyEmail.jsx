import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
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
        <GuestLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <form onSubmit={handleSend} className='space-y-6'>
                {status === 'verification-link-sent' && (
                    <Alert className="border-primary">
                        <AlertDescription className="text-primary">
                            A new verification link has been sent to the email address
                            you provided during registration.
                        </AlertDescription>
                    </Alert>
                )}
                <Button variant="secondary" className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Resend verification email
                </Button>
                <Link href={route('logout')} method="post" className="mx-auto block text-sm hover:underline">
                    Log out
                </Link>
            </form>
        </GuestLayout>
    );
}