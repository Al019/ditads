import { router } from '@inertiajs/react';
import { createContext, useContext, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Lock } from 'lucide-react';
import { Button } from './ui/button';

const SecurityModal = createContext();

export const useSecurity = () => useContext(SecurityModal);

export const SecurityProvider = ({ children }) => {
  const [open, setOpen] = useState(false)

  return (
    <SecurityModal.Provider value={{ setOpen }}>
      {children}
      <Dialog open={open}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Security Alert</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-4 items-center'>
            <Lock size={80} className='text-destructive' />
            <DialogDescription>
              Please change your password!
            </DialogDescription>
            <Button onClick={() => router.visit(route('profile.information'))} className="w-full">
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SecurityModal.Provider>
  );
};