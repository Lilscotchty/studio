
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateSuccess: () => void;
  paymentLink: string;
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onSimulateSuccess,
  paymentLink,
}: SubscriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-xl">Unlock Premium Features</DialogTitle>
          <DialogDescription>
            Subscribe to MarketVision Pro to get unlimited access to Chart Analysis, Live Analysis, and all other premium features.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the button below to proceed to our secure payment page. After successful payment, your premium access will be activated.
          </p>
          <Button
            asChild
            className="w-full bg-primary hover:bg-primary/90"
          >
            <a href={paymentLink} target="_blank" rel="noopener noreferrer" onClick={onClose}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Proceed to Payment
            </a>
          </Button>
          <p className="text-xs text-center text-muted-foreground pt-2">
            For testing purposes:
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onSimulateSuccess();
              onClose();
            }}
          >
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Simulate Successful Payment (Test Only)
          </Button>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
