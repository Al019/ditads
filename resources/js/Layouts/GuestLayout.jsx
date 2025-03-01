import { Card } from "@/components/ui/card";
import Logo from '../../../public/images/logo.png';
import { Link } from "@inertiajs/react";
import { ModeToggle } from "@/Components/mode-toggle";
import { Label } from "@/Components/ui/label";

export default function GuestLayout({ children }) {
    return (
        <div className='min-h-screen flex items-center justify-center sm:p-6'>
            <Card className="w-full max-w-4xl max-sm:rounded-none">
                <div className="grid grid-cols-2 items-center max-md:p-6 md:grid-cols-1">
                    <Link href='/' className="flex items-center gap-2 md:hidden">
                        <img src={Logo} className="object-contain size-16" />
                        <Label className="font-bold text-lg">DITADS</Label>
                    </Link>
                    <div className="flex justify-end md:px-6 md:pt-6">
                        <ModeToggle />
                    </div>
                </div>
                <div className="grid grid-cols-2 md:min-h-[500px] max-md:grid-cols-1">
                    <div className="flex items-center justify-center">
                        <div className="w-full sm:max-w-sm">
                            {children}
                        </div>
                    </div>
                    <div className="flex items-center justify-center max-md:hidden">
                        <Link href='/'>
                            <img src={Logo} className="object-contain size-72" />
                        </Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
