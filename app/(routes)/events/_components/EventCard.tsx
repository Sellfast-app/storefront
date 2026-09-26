import { Ticket, CalendarDays, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Event } from "@/lib/events-data";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const isMultiDay = start.toDateString() !== end.toDateString();
  const paidTickets = event.tickets.filter((ticket) => ticket.type === "paid");
  const lowestPaidTicket = paidTickets.reduce<number | null>((lowest, ticket) => {
    const price = ticket.price ?? 0;
    if (lowest === null) return price;
    return Math.min(lowest, price);
  }, null);

  return (
    <Link href={`/events/${event.id}`} className="block">
      <div className="group rounded-xl overflow-hidden bg-white dark:bg-[#1A1A1A] border border-[#F0F0F0] dark:border-[#2A2A2A] hover:border-[#005B1414] hover:shadow-lg hover:shadow-[#005B1414] transition-all duration-300">
        {/* Cover Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={event.coverImage}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                event.bannerColor
                  ? `linear-gradient(to top, ${event.bannerColor}88, transparent)`
                  : "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
            }}
          />
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                event.status === "published"
                  ? "bg-green-600"
                  : event.status === "draft"
                  ? "bg-amber-500"
                  : "bg-gray-500"
              }`}
            >
              {event.status === "published" ? "Live" : event.status === "draft" ? "Draft" : "Ended"}
            </span>
          </div>

          {/* Date on image */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-1.5 text-white text-xs">
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="font-medium">
                {format(start, "dd MMM yyyy")}
                {isMultiDay && (
                  <span className="opacity-80"> - {format(end, "dd MMM yyyy")}</span>
                )}
              </span>
              {event.startDate !== event.endDate && (
                <>
                  <span className="opacity-60">•</span>
                  <span className="opacity-80">
                    {format(start, "HH:mm")} - {format(end, "HH:mm")}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white group-hover:text-primary transition-colors line-clamp-2">
            {event.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate flex-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.organizerName}</span>
          </div>

          {/* Ticket Summary */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#F0F0F0] dark:border-[#2A2A2A]">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Tickets from</p>
              <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white">
                {lowestPaidTicket === null ? "Free" : `₦${lowestPaidTicket.toLocaleString()}`}
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-[#005B1414] px-2.5 py-1 text-xs font-medium text-primary">
              {event.tickets.reduce((s, t) => s + t.sold, 0).toLocaleString()} /{" "}
              {event.totalCapacity.toLocaleString()} sold
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface EventsListProps {
  events: Event[];
  title?: string;
  showEmptyState?: boolean;
}

export function EventsList({ events, title, showEmptyState = true }: EventsListProps) {
  if (events.length === 0 && showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Ticket className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base">No events yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Create your first event to start selling tickets to your audience.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">{title}</h2>
          <span className="text-sm text-muted-foreground">{events.length} events</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
