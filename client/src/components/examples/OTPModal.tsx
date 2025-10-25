import { useState } from 'react';
import OTPModal from '../OTPModal';
import { Button } from '@/components/ui/button';

export default function OTPModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)} data-testid="button-open-otp">
        Open OTP Modal
      </Button>
      <OTPModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onVerify={(code) => {
          console.log('OTP verified:', code);
          setIsOpen(false);
        }}
        email="user@example.com"
        onResend={() => console.log('Resend OTP')}
      />
    </div>
  );
}
