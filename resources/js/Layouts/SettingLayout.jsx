import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "./AuthenticatedLayout";

const settingItems = [
  {
    title: 'Profile',
    href: '/settings/profile',
  },
  {
    title: 'Password',
    href: '/settings/password',
  },
]

const SettingLayout = ({ children }) => {
  const currentPath = window.location.pathname;

  return (
    <div className="flex max-lg:flex-col gap-4">
      <div className="w-full max-w-[250px] flex lg:flex-col gap-1">
        {settingItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            asChild
            className={cn('w-full justify-start', {
              'bg-muted': currentPath === item.href,
            })}
          >
            <Link href={item.href}>
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
      <div className="w-full max-w-2xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export default SettingLayout