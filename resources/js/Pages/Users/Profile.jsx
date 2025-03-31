import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { usePage } from "@inertiajs/react"

const Profile = () => {
  const { information } = usePage().props

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <h1 className="mb-0.5 text-base font-medium">
          Profile Information
        </h1>
        <div className='space-y-6'>
          <div className='grid sm:grid-cols-2 gap-4'>
            <div className="space-y-1">
              <Label>Last name</Label>
              <Input value={information.last_name} readOnly />
            </div>
            <div className="space-y-1">
              <Label>First name</Label>
              <Input value={information.first_name} readOnly />
            </div>
            <div className="space-y-1">
              <Label>Middle name</Label>
              <Input value={information.middle_name ? information.middle_name : '-'} readOnly />
            </div>
            <div className="space-y-1">
              <Label>Gender</Label>
              <Input value={information.gender ? information.gender : '-'} readOnly />
            </div>
            <div className="space-y-1">
              <Label>Email address</Label>
              <Input value={information.email} readOnly />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Profile.layout = page => <AuthenticatedLayout children={page} title="Profile" />

export default Profile