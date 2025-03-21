import InputError from "@/Components/input-error"
import { InputPassword } from "@/Components/input-password"
import { Avatar, AvatarFallback } from "@/Components/ui/avatar"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Label } from "@/Components/ui/label"
import { Separator } from "@/Components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useForm, usePage } from "@inertiajs/react"
import { useState } from "react"
import { toast } from "sonner"

const tabs = ["Personal Details", "Change Password"]

const Information = () => {
  const user = usePage().props.auth.user;
  const [activeTab, setActiveTab] = useState(user.is_default === 0 ? "Change Password" : "Personal Details")
  const { data, setData, post, processing, errors, reset, setError } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSave = (e) => {
    e.preventDefault()
    setError({ current_password: null, password: null, password_confirmation: null })
    post(route('profile.change.password'), {
      onSuccess: () => {
        reset()
        toast.success("Change password successfully.")
      }
    });
  }

  return (
    <Tabs defaultValue={activeTab}>
      <AuthenticatedLayout title="My Profile" tab={
        <div className="flex justify-start mb-2">
          <TabsList>
            {tabs.map((tab, index) => (
              <TabsTrigger key={index} value={tab} onClick={() => setActiveTab(tab)}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      }>
        <TabsContent value="Personal Details">
          <div className="max-w-[800px] mx-auto space-y-4">
            <Card>
              <CardHeader>
                <div className='flex items-center gap-4'>
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {user.first_name.charAt(0)}
                      {user.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='space-y-1'>
                    <CardTitle>
                      {user.first_name} {user.last_name}
                    </CardTitle>
                    <div>
                      <Badge>
                        <span className="capitalize">{user.role === 'admin' ? 'Administrator' : user.role}</span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs">Last Name</Label>
                    <Label>{user.last_name}</Label>
                    <Separator />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">First Name</Label>
                    <Label>{user.last_name}</Label>
                    <Separator />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Middle Name</Label>
                    <Label>{user.middle_name === null ? '-' : user.middle_name}</Label>
                    <Separator />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Gender</Label>
                    <Label>{user.gender === null ? '-' : user.gender}</Label>
                    <Separator />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs">Email Address</Label>
                    <Label>{user.email}</Label>
                    <Separator />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="Change Password">
          <div className="max-w-[800px] mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave}>
                  <div className="space-y-4">
                    {user.is_default === 1 && (
                      <div className="grid grid-cols-2">
                        <div className="space-y-1">
                          <Label>Current Password</Label>
                          <InputPassword value={data.current_password} onChange={(e) => setData('current_password', e.target.value)} />
                          <InputError message={errors.current_password} />
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2">
                      <div className="space-y-1">
                        <Label>New Password</Label>
                        <InputPassword value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        <InputError message={errors.password} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="space-y-1">
                        <Label>Confirm Password</Label>
                        <InputPassword value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        <InputError message={errors.password_confirmation} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button disabled={processing}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </AuthenticatedLayout>
    </Tabs>
  )
}

export default Information