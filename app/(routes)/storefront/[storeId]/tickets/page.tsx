import Link from "next/link";
import { ArrowLeft, Mail, Ticket } from "lucide-react";

export default async function MyTicketsPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  return <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
    <Link href={`/storefront/${storeId}`} className="inline-flex items-center gap-2 text-sm text-[#005B14]"><ArrowLeft className="h-4 w-4" />Back to events</Link>
    <section className="py-12 text-center">
      <Ticket className="mx-auto mb-4 h-9 w-9 text-[#005B14]" />
      <h1 className="text-2xl font-semibold">Your tickets</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">After payment is confirmed, your ticket QR codes and event details are sent to the email address used at checkout.</p>
      <p className="mt-4 inline-flex items-center gap-2 text-xs text-gray-500"><Mail className="h-4 w-4" />Check your inbox and spam folder.</p>
    </section>
  </main>;
}
