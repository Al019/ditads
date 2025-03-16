import { InputPassword } from '@/Components/input-password';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import GuestLayout from '@/Layouts/GuestLayout';
import { useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleReset = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <form onSubmit={handleReset}>
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>Please make your new password.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {(errors.password || errors.password_confirmation) && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    {errors.password || errors.password_confirmation}
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-1">
                            <Label>Password</Label>
                            <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                        </div>
                        <div className="space-y-1">
                            <Label>Confirm Password</Label>
                            <InputPassword value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={processing}>
                        Reset Password
                    </Button>
                </CardFooter>
            </form>
        </GuestLayout>
    );
}
