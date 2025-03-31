import InputError from '@/Components/input-error';
import { InputPassword } from '@/Components/input-password';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleReset = (e) => {
        e.preventDefault();
        clearErrors()
        post(route('password.store'));
    };

    return (
        <GuestLayout title="Reset password" description="Please enter your new password below.">
            <form onSubmit={handleReset} className='space-y-6'>
                <div className='space-y-4'>
                    <div className="space-y-1">
                        <Label>Password</Label>
                        <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <InputError message={errors.password} />
                    </div>
                    <div className="space-y-1">
                        <Label>Confirm password</Label>
                        <InputPassword value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        <InputError message={errors.password_confirmation} />
                    </div>
                </div>
                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Reset password
                </Button>
            </form>
        </GuestLayout>
    );
}
