import { router } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Lock } from 'lucide-react';
import { Button } from './ui/button';

const SecurityModal = createContext();

export const useSecurity = () => useContext(SecurityModal);

export const SecurityProvider = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <SecurityModal.Provider value={{ setOpen }}>
      {children}
      <AlertDialog open={open}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">
              Security Alert
            </AlertDialogTitle>
            <div className='flex flex-col gap-4 items-center'>
              <Lock size={80} className='text-destructive' />
              <AlertDialogDescription>
                Please change your password!
              </AlertDialogDescription>
              <Button onClick={() => router.visit(route('profile.information'))} className="w-full">
                Change Password
              </Button>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </SecurityModal.Provider>
  );
};