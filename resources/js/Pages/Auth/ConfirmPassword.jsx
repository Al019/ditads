import InputError from '@/Components/input-error';
import { InputPassword } from '@/Components/input-password';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, clearErrors } = useForm({
        password: '',
    });

    const handleConfirm = (e) => {
        e.preventDefault();
        clearErrors()
        post(route('password.confirm'));
    };

    return (
        <GuestLayout title="Confirm your password" description="This is a secure area of the application. Please confirm your password before continuing.">
            <form onSubmit={handleConfirm} className="space-y-6">
                <div className="space-y-1">
                    <Label>Password</Label>
                    <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} />
                    <InputError message={errors.password} />
                </div>
                <Button className="w-full" disabled={processing}>
                    {processing && <LoaderCircle className="size-4 animate-spin" />}
                    Confirm password
                </Button>
            </form>
        </GuestLayout>
    );
}
