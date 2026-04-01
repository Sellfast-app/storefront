"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ModalIcon from "./svgIcons/ModalIcon";

interface SubscriptionModalProps {
  isOpen: boolean;
  onSubscribe: () => void;
}

export function SubscriptionModal({ isOpen, onSubscribe }: SubscriptionModalProps) {
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isSubmittingNotify, setIsSubmittingNotify] = useState(false);

  const handleNotifySubmit = async () => {
    if (!notifyEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(notifyEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmittingNotify(true);
    const submitToast = toast.loading('Submitting...');

    try {
      const response = await fetch('/api/stores/join-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notifyEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to join waitlist');
      }

      toast.dismiss(submitToast);
      toast.success("You'll be notified when this store is active!");
      setNotifyEmail("");
      setShowNotifyForm(false); // ← go back to main view
    } catch (error) {
      toast.dismiss(submitToast);
      toast.error(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmittingNotify(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogOverlay className="backdrop-blur-xs bg-[#06140033] dark:bg-black/50" />
      <DialogContent className="sm:max-w-[500px] [&>button]:hidden">

        {/* Title */}
        <div className="mb-2">
          <h2 className="text-sm font-semibold">Storefront Update</h2>
          <p className="text-xs text-muted-foreground">Here&apos;s a simple message from this Swiftree</p>
        </div>

        {!showNotifyForm ? (
          /* ── Main View ── */
          <div className="flex flex-col text-center space-y-2">
            <div className="w-full max-w-sm mx-auto flex justify-center py-2">
              <ModalIcon />
            </div>

            <h3 className="text-lg font-semibold">This Store Isn&apos;t Active Right Now</h3>
            <p className="text-xs text-muted-foreground px-2">
              Looks like this store hasn&apos;t completed their setup yet, so you can&apos;t place
              orders at the moment. To get notified once they&apos;re up and running again,
              click the button below.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowNotifyForm(true)}>
                Check back later
              </Button>
              <Button onClick={() => setShowNotifyForm(true)}>
                Notify me
              </Button>
            </div>
          </div>
        ) : (
          /* ── Notify Form View ── */
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-semibold text-center">
              Notify Me When This Store is Active
            </h3>
            <p className="text-xs text-muted-foreground text-center">
              To make sure you&apos;re properly informed when this store is active again, please
              enter your email and you&apos;ll receive a message from Swiftree.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">
                  Email address <span className="text-red-500">*</span>
                </Label>
              </div>
              <Input
                type="email"
                placeholder="e.g johndoe@example.com"
                value={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.value)}
                className="dark:bg-background"
                onKeyDown={(e) => e.key === 'Enter' && handleNotifySubmit()}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => { setShowNotifyForm(false); setNotifyEmail(""); }}
                disabled={isSubmittingNotify}
              >
                Close
              </Button>
              <Button
                onClick={handleNotifySubmit}
                disabled={isSubmittingNotify}
              >
                {isSubmittingNotify ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}