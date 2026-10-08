"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Download, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketOrder, readTicketOrders, downloadBooking } from "@/lib/ticket-preview";
import { isMockEventStorefront } from "@/lib/storefront-mock";

export default function MyTicketsPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [orders, setOrders] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      if (isMockEventStorefront(storeId)) setOrders(readTicketOrders().filter(order => order.storeId === storeId).reverse());
    } catch { setError("Your saved tickets could not be loaded."); }
    setLoading(false);
  }, [storeId]);

  return <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
    <Link href={`/storefront/${storeId}`} className="inline-flex items-center gap-2 text-sm text-[#005B14]"><ArrowLeft className="h-4 w-4" />Back to events</Link>
    <div><h1 className="text-2xl font-semibold">My tickets</h1><p className="mt-1 text-sm text-gray-500">Test bookings on this device · Not valid for admission</p></div>
    {error && <p role="alert" className="text-red-600">{error}</p>}
    {loading ? <div className="h-48 animate-pulse rounded-lg bg-gray-100" aria-label="Loading tickets" /> : !orders.length ?
      <div className="py-16 text-center"><Ticket className="mx-auto mb-3 h-8 w-8 text-gray-400" /><p>No tickets yet</p></div> :
      orders.map(order => <section key={order.id} className="space-y-4 border-b pb-6">
        <div><h2 className="text-lg font-semibold">{order.eventName}</h2><p className="text-sm text-gray-500">{order.eventDate} · {order.location}</p></div>
        {order.admissions.map((ticket, index) => <div key={ticket.id} className="flex flex-col items-center gap-4 rounded-lg border p-4 sm:flex-row">
          <QRCodeSVG value={ticket.token} size={128} marginSize={4} aria-label={"Test ticket " + (index + 1)} />
          <div className="min-w-0"><p className="font-semibold">{ticket.ticketName}</p><p className="text-sm">{order.customer.firstName} {order.customer.lastName}</p><p className="mt-2 break-all font-mono text-xs text-gray-500">{ticket.token}</p></div>
        </div>)}
        <Button variant="outline" className="gap-2" onClick={() => downloadBooking(order)}><Download className="h-4 w-4" />Download preview booking</Button>
      </section>)}
  </main>;
}
