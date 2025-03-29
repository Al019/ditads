import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu"
import { Link, router } from "@inertiajs/react"
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import AppLogo from "@/Components/app-logo";

const NavItems = [
  {
    title: 'Research Consultants',
    href: '#'
  },
  {
    title: 'Research Journals',
    href: '#'
  },
  {
    title: 'About Us',
    href: '#'
  },
  {
    title: 'Contact Us',
    href: '#'
  },

]

const WebLayout = ({ children }) => {
  const user = usePage().props.auth.user;

  return (
    <>
      <div className="border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2  p-4">
          <div className="flex items-center gap-4">
            <Link href={route('welcome')}>
              <AppLogo className="size-14" />
            </Link>
            <NavigationMenu>
              <NavigationMenuList>
                {NavItems.map((item, index) => (
                  <NavigationMenuItem>
                    <Link key={index} href={item.href}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href={`/${user.role}/dashboard`}>
                <Button>
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href={route('login')}>
                  <Button variant="ghost">
                    Log In
                  </Button>
                </Link>
                <Link href={route('register')}>
                  <Button variant="outline">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4">
        {children}
      </div>
    </>
  )
}

export default WebLayout