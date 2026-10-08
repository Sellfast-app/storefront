"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Download, ArrowLeft, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketOrder, downloadBooking, mergeTicketOrder, readTicketOrders, writeTicketOrders } from "@/lib/ticket-preview";

interface Props {
  booking: Omit<TicketOrder, "id" | "createdAt" | "admissions" | "version" | "mode" | "status" | "channel">;
  selections: { ticketId: string; name: string; quantity: number }[];
  onBack: () => void;
}

export function TicketPaymentPreview({ booking, selections, onBack }: Props) {
  const [order, setOrder] = useState<TicketOrder | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef<TicketOrder | null>(null);
  const locked = useRef(false);

  const issue = () => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      if (!selections.length || selections.some(item => !Number.isInteger(item.quantity) || item.quantity < 1)) {
        throw new Error("Select at least one ticket.");
      }
      const next = pending.current ?? {
        ...booking, version: 1 as const, mode: "preview" as const,
        id: "TEST-" + crypto.randomUUID(), createdAt: new Date().toISOString(),
        status: "confirmed" as const, channel: "website" as const,
        admissions: selections.flatMap(item => Array.from({ length: item.quantity }, () => ({
          id: crypto.randomUUID(), token: "swiftree:test:" + crypto.randomUUID(),
          ticketTypeId: item.ticketId, ticketName: item.name, checkedInAt: null,
        }))),
      };
      pending.current = next;
      writeTicketOrders(mergeTicketOrder(readTicketOrders(), next));
      setOrder(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save the booking. Please try again.");
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-xs font-medium text-amber-800">Test checkout · No charge or email will be sent</p>
      {order ? <>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#005B14]" />
          <div><h3 className="text-lg font-semibold">Your test tickets are ready</h3>
            <p className="break-words text-sm text-gray-600">{order.eventName} · {order.customer.email}</p></div>
        </div>
        <p className="text-sm text-gray-600">{order.eventDate} · {order.location}</p>
        {order.admissions.map((admission, index) => (
          <div key={admission.id} className="flex flex-col items-center gap-3 rounded-lg border p-4 sm:flex-row">
            <QRCodeSVG value={admission.token} size={128} marginSize={4} aria-label={"Test admission QR code " + (index + 1)} />
            <div className="min-w-0 text-center sm:text-left">
              <p className="font-semibold">{admission.ticketName}</p>
              <p className="text-sm">{order.customer.firstName} {order.customer.lastName}</p>
              <p className="mt-1 text-xs text-gray-500">Admission {index + 1} of {order.admissions.length} · Test only</p>
              <p className="mt-2 break-all font-mono text-xs text-gray-500">{admission.token}</p>
            </div>
          </div>
        ))}
        <Button className="w-full gap-2 bg-[#005B14] hover:bg-[#004610]" onClick={() => downloadBooking(order)}>
          <Download className="h-4 w-4" /> Download preview booking
        </Button>
      </> : <>
        <div className="border-b pb-4">
          <p className="font-semibold">{booking.eventName}</p>
          <p className="mt-1 text-sm text-gray-600">{selections.reduce((sum, item) => sum + item.quantity, 0)} tickets</p>
          <p className="mt-3 text-xl font-semibold">₦{booking.total.toLocaleString()}</p>
        </div>
        <Button disabled={busy} onClick={issue} className="w-full gap-2 bg-[#005B14] hover:bg-[#004610]">
          <Ticket className="h-4 w-4" />{busy ? "Issuing..." : booking.total === 0 ? "Confirm free test booking" : "Simulate successful payment"}
        </Button>
        {booking.total > 0 && <Button variant="outline" className="w-full" onClick={() => setError("Test payment failed. No tickets were issued. You can try again.")}>Simulate failed payment</Button>}
        <Button variant="ghost" className="gap-2" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Back to details</Button>
      </>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
