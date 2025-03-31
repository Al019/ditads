import InputError from '@/Components/input-error';
import { InputPassword } from '@/Components/input-password';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SettingLayout from '@/Layouts/SettingLayout'
import { useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const Password = () => {
  const user = usePage().props.auth.user;
  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleUpdate = (e) => {
    e.preventDefault()
    clearErrors()
    post(route('setting.password.update'), {
      onSuccess: () => {
        reset()
        toast.success("Password updated successfully.")
      }
    });
  }

  return (
    <div className="space-y-4">
      <h1 className="mb-0.5 text-base font-medium">
        Update Password
      </h1>
      <form onSubmit={handleUpdate}>
        <div className='space-y-6'>
          <div className='space-y-4'>
            {user.is_default === 0 && (
              <div className="grid sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Current Password</Label>
                  <InputPassword value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
                  <InputError message={errors.current_password} />
                </div>
              </div>
            )}
            <div className="grid sm:grid-cols-2">
              <div className="space-y-1">
                <Label>New Password</Label>
                <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} />
                <InputError message={errors.password} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Confirm Password</Label>
                <InputPassword value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                <InputError message={errors.password_confirmation} />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button disabled={processing}>
              {processing && <LoaderCircle className="size-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

Password.layout = page => (
  <AuthenticatedLayout title="Settings">
    <SettingLayout children={page} />
  </AuthenticatedLayout>
)

export default Password