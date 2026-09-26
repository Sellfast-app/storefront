"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Event, TicketType } from "@/lib/events-data";

interface TicketSelectionProps {
  event: Event;
}

type TicketQuantities = Record<string, number>;

const getTicketPrice = (ticket: TicketType) => {
  if (ticket.type === "free" || ticket.type === "invite") return 0;
  return ticket.price ?? 0;
};

export function TicketSelection({ event }: TicketSelectionProps) {
  const [quantities, setQuantities] = useState<TicketQuantities>({});

  const selectedTickets = useMemo(
    () =>
      event.tickets
        .map((ticket) => ({
          ticket,
          quantity: quantities[ticket.id] || 0,
        }))
        .filter((item) => item.quantity > 0),
    [event.tickets, quantities]
  );

  const subtotal = selectedTickets.reduce(
    (sum, item) => sum + getTicketPrice(item.ticket) * item.quantity,
    0
  );
  const markupFee = selectedTickets.reduce((sum, item) => sum + 500 * item.quantity, 0);
  const total = subtotal + markupFee;
  const totalQuantity = selectedTickets.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (ticket: TicketType, nextQuantity: number) => {
    const available = Math.max(ticket.quantity - ticket.sold, 0);
    const cappedQuantity = Math.max(
      0,
      Math.min(nextQuantity, available, ticket.orderLimitPerPerson)
    );

    setQuantities((current) => ({
      ...current,
      [ticket.id]: cappedQuantity,
    }));
  };

  return (
    <Card className="sticky top-6 border-[#F0F0F0] dark:border-[#2A2A2A]">
      <CardHeader className="border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Select tickets</CardTitle>
          <div className="rounded-full bg-[#005B1414] px-3 py-1 text-xs font-medium text-primary">
            {totalQuantity} selected
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        {event.tickets.map((ticket) => {
          const available = Math.max(ticket.quantity - ticket.sold, 0);
          const quantity = quantities[ticket.id] || 0;
          const isInviteOnly = ticket.type === "invite";
          const isSoldOut = available === 0;

          return (
            <div
              key={ticket.id}
              className="rounded-lg border border-[#F0F0F0] p-4 dark:border-[#2A2A2A]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">{ticket.name}</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {isInviteOnly
                      ? "Invite-only access"
                      : `${available.toLocaleString()} available • Limit ${ticket.orderLimitPerPerson} per person`}
                  </p>
                  <p className="mt-2 text-base font-bold">
                    {ticket.type === "free"
                      ? "Free"
                      : isInviteOnly
                      ? "Invite only"
                      : `₦${getTicketPrice(ticket).toLocaleString()}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    disabled={quantity === 0 || isInviteOnly}
                    onClick={() => updateQuantity(ticket, quantity - 1)}
                    aria-label={`Reduce ${ticket.name} quantity`}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="w-6 text-center text-sm font-medium">{quantity}</span>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="outline"
                    disabled={isSoldOut || isInviteOnly || quantity >= ticket.orderLimitPerPerson}
                    onClick={() => updateQuantity(ticket, quantity + 1)}
                    aria-label={`Increase ${ticket.name} quantity`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tickets subtotal</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Swiftree markup</span>
            <span>₦{markupFee.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-3 font-semibold dark:border-[#2A2A2A]">
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <Button className="h-11 w-full bg-[#4FCA6A] hover:bg-[#45B862]" disabled={totalQuantity === 0}>
          <ShoppingBag className="h-4 w-4" />
          Continue to checkout
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Tickets are available on website, WhatsApp AI, and web chat channels.
        </p>
      </CardContent>
    </Card>
  );
}
