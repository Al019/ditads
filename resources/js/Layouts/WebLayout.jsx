import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/Components/ui/navigation-menu"
import { Link } from "@inertiajs/react"
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import AppLogo from "@/Components/app-logo";
import { Facebook, Instagram, Mail, MapPin, Menu, Phone, Twitter, Youtube } from "lucide-react";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import { useState } from "react";
import { ModeToggle } from "@/Components/mode-toggle";

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
  const [open, setOpen] = useState(false)
  const appName = import.meta.env.VITE_APP_NAME;
  const appEmail = import.meta.env.VITE_APP_EMAIL;
  const appPhone = import.meta.env.VITE_APP_PHONE;
  const appFacebook = import.meta.env.VITE_APP_FACEBOOK;

  return (
    <>
      <header className="h-16 fixed w-full flex items-center bg-background border-b">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 px-4 max-lg:justify-between">
          <Link href={route('welcome')}>
            <AppLogo className="size-12" />
          </Link>
          <div className="lg:w-full flex items-center gap-2">
            <Button onClick={() => setOpen(true)} size="icon" variant="ghost" className="lg:hidden">
              <Menu />
            </Button>
            <div className="w-full flex items-center justify-between max-lg:hidden">
              <div className="flex items-center gap-4">
                <NavigationMenu>
                  <NavigationMenuList>
                    {NavItems.map((item, index) => (
                      <NavigationMenuItem key={index}>
                        <Link href={item.href}>
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
                        Log in
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
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto min-h-screen">
        {children}
      </main>
      <footer className="bg-primary">
        <div className="max-w-7xl mx-auto p-4 py-6 lg:py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center">
                <AppLogo className="size-16 me-3" />
                <span className="self-center text-2xl font-semibold whitespace-nowrap">
                  {appName}
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase">Contact Us</h2>
                <ul className="font-medium">
                  <li className="mb-4">
                    <a href={`mailto:${appEmail}`} className="hover:underline break-words">{appEmail}</a>
                  </li>
                  <li>
                    <a href={`tel:${appPhone}`} className="hover:underline break-words">{appPhone}</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase">Follow us</h2>
                <ul className="font-medium">
                  <li className="mb-4">
                    <a href={appFacebook} target="_blank" className="hover:underline break-words">Facebook</a>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-sm font-semibold uppercase">Legal</h2>
                <ul className="font-medium">
                  <li className="mb-4">
                    <a href="#" className="hover:underline break-words">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline break-words">Terms &amp; Conditions</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr className="my-6 border sm:mx-auto lg:my-8" />
          <div className="flex justify-center">
            <span className="text-sm">© {new Date().getFullYear()} <a href="/" className="hover:underline">{appName}</a>. All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>

      <Drawer open={open} onOpenChange={() => setOpen(false)}>
        <DrawerContent>
          <div className="grid gap-2 p-4">
            {NavItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <Button onClick={() => setOpen(false)} variant="ghost" className="w-full">
                  {item.title}
                </Button>
              </Link>
            ))}
            {user ? (
              <Link href={`/${user.role}/dashboard`}>
                <Button onClick={() => setOpen(false)} className="w-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="grid items-center grid-cols-2 gap-2">
                <Link href={route('login')}>
                  <Button onClick={() => setOpen(false)} variant="ghost" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href={route('register')}>
                  <Button onClick={() => setOpen(false)} variant="outline" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default WebLayout