import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ClockIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UsersIcon,
  TrendingUpIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, getEventById } from "@/lib/events-data";
import { TicketSelection } from "./_components/TicketSelection";

function getEventDates(event: Event): string[] {
  const dates: string[] = [];
  const current = new Date(event.startDate);
  const end = new Date(event.endDate);

  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = getEventById(eventId);

  if (!event || event.status !== "published") {
    notFound();
  }

  const dates = getEventDates(event);
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);
  const totalSold = event.tickets.reduce((sum, t) => sum + t.sold, 0);
  const totalCapacity = event.tickets.reduce((sum, t) => sum + t.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src={event.coverImage}
            alt={event.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, transparent 40%, ${event.bannerColor || "rgba(0,0,0,0.85)"} 100%)`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Events
            </Link>
          </div>

          <div className="mb-6">
            <Badge
              className={`mb-3 ${event.status === "published" ? "bg-green-600" : event.status === "draft" ? "bg-amber-500" : "bg-gray-500"}`}
            >
              {event.status === "published"
                ? "Live Now"
                : event.status === "draft"
                ? "Draft"
                : "Ended"}
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight line-clamp-3">
              {event.name}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-white text-sm sm:text-base mb-8">
            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="w-5 h-5" />
              <span>
                {format(start, "EEEE, dd MMMM yyyy")}
                {dates.length > 1 && (
                  <>  - {format(end, "dd MMMM yyyy")}</>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              <span className="max-w-[220px] truncate">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-white/80 text-sm mb-8">
            <UsersIcon className="w-4 h-4" />
            <span>
              Organized by{" "}
              <span className="text-white font-medium">
                {event.organizerName}
              </span>
            </span>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 text-white/80 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
              <TrendingUpIcon className="w-4 h-4 text-green-400" />
              <span>{totalSold} / {totalCapacity} tickets sold</span>
            </div>
            {event.minAge && (
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <CalendarDaysIcon className="w-4 h-4 text-white/70" />
                <span>{event.minAge}+ years</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left column: details */}
          <div className="space-y-6">
            <Card className="border-[#F0F0F0] dark:border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-lg">About this event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {dates.length > 1 && (
              <Card className="border-[#F0F0F0] dark:border-[#2A2A2A]">
                <CardHeader>
                  <CardTitle className="text-lg">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dates.map((date) => (
                      <button
                        key={date}
                        onClick={() => {}}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          date === event.startDate
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                        }`}
                      >
                        {format(new Date(date), "EEE, dd MMM")}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-[#F0F0F0] dark:border-[#2A2A2A]">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3 text-sm">
                    <CalendarDaysIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {format(new Date(event.startDate), "EEEE, dd MMMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-medium">
                        {event.startTime} - {event.endTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm col-span-2">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium truncate flex-1">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#F0F0F0] dark:border-[#2A2A2A]">
              <CardHeader>
                <CardTitle className="text-lg">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{event.organizerName}</p>
                  {event.organizerEmail && (
                    <p className="text-muted-foreground">
                      <a
                        href={`mailto:${event.organizerEmail}`}
                        className="hover:text-primary"
                      >
                        {event.organizerEmail}
                      </a>
                    </p>
                  )}
                  {event.organizerPhone && (
                    <p className="text-muted-foreground">
                      <a
                        href={`tel:${event.organizerPhone}`}
                        className="hover:text-primary"
                      >
                        {event.organizerPhone}
                      </a>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column: ticket selection */}
          <div className="lg:block">
            <TicketSelection event={event} />
          </div>
        </div>
      </div>
    </div>
  );
}
