import InputError from '@/Components/input-error';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        email: '',
    });

    const handleSend = (e) => {
        e.preventDefault();
        clearErrors()
        post(route('password.email'));
    };

    return (
        <GuestLayout title="Forgot password" description="Enter your email to receive a password reset link.">
            <form onSubmit={handleSend} className="space-y-6">
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
                </div>
                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Email password reset link
                </Button>
                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>Or, return to</span>
                    <Link href={route('login')} className="hover:underline">
                        log in
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
