import { EventsList } from "./_components/EventCard";
import { getPublishedEvents } from "@/lib/events-data";

export default function EventsPage() {
  const events = getPublishedEvents();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#005B1414] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-5 h-5 text-primary"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-white">Events</h1>
              <p className="text-sm text-muted-foreground">Browse and buy tickets to upcoming events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventsList events={events} title="Upcoming Events" />
      </div>

      {/* Footer */}
      <div className="border-t border-[#F0F0F0] dark:border-[#2A2A2A] py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          Powered by Swiftree — Sell tickets to your audience across every channel.
        </div>
      </div>
    </div>
  );
}
