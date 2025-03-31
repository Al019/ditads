import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SettingLayout from '@/Layouts/SettingLayout'
import { usePage } from '@inertiajs/react';

const Profile = () => {
  const user = usePage().props.auth.user;

  return (
    <div className="space-y-4">
      <h1 className="mb-0.5 text-base font-medium">
        Profile Information
      </h1>
      <div className='space-y-6'>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div className="space-y-1">
            <Label>Last name</Label>
            <Input value={user.last_name} readOnly />
          </div>
          <div className="space-y-1">
            <Label>First name</Label>
            <Input value={user.first_name} readOnly />
          </div>
          <div className="space-y-1">
            <Label>Middle name</Label>
            <Input value={user.middle_name ? user.middle_name : '-'} readOnly />
          </div>
          <div className="space-y-1">
            <Label>Gender</Label>
            <Input value={user.gender ? user.gender : '-'} readOnly />
          </div>
          <div className="space-y-1">
            <Label>Email address</Label>
            <Input value={user.email} readOnly />
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.layout = page => (
  <AuthenticatedLayout title="Settings">
    <SettingLayout children={page} />
  </AuthenticatedLayout>
)

export default Profile