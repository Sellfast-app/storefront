"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import ModalIcon from "./svgIcons/ModalIcon";

interface AvailabilityModalProps {
  isOpen: boolean;
  storeName: string;
  nextOpening: string | null;
}

export function AvailabilityModal({
  isOpen,
  storeName,
  nextOpening,
}: AvailabilityModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogOverlay className="backdrop-blur-xs bg-[#06140033] dark:bg-black/50" />
      <DialogContent className="sm:max-w-[500px] [&>button]:hidden">
        <div className="mb-2">
          <h2 className="text-sm font-semibold">Storefront Update</h2>
          <p className="text-xs text-muted-foreground">
            Here&apos;s a simple message from{" "}
            <span className="font-bold text-[#4FCA6A]">{storeName}</span>
          </p>
        </div>

        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex w-full max-w-sm justify-center py-2">
            <ModalIcon />
          </div>

          <h3 className="text-lg font-semibold">
            This Store Is Not Open Right Now
          </h3>
          <p className="px-2 text-xs text-muted-foreground">
            This store is currently outside its operating hours and cannot
            accept orders.
            {nextOpening
              ? ` ${storeName} will be open ${nextOpening}.`
              : " Please check back when the store is open."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
