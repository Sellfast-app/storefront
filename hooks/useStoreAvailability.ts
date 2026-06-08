import { useEffect, useMemo, useState } from "react";

export interface StoreAvailabilityEntry {
  day: string;
  openTime: string;
  closeTime: string;
}

const STORE_TIME_ZONE = "Africa/Lagos";
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

function getTimeInStoreZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STORE_TIME_ZONE,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return {
    day: values.weekday,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function parseTime(time: string) {
  const match = time.match(timePattern);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatOpeningTime(time: string) {
  const minutes = parseTime(time);
  if (minutes === null) return time;

  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function getNextOpening(
  availability: StoreAvailabilityEntry[],
  date: Date
) {
  const { day, minutes } = getTimeInStoreZone(date);
  const todayIndex = DAYS.indexOf(day);

  for (let dayOffset = 0; dayOffset <= DAYS.length; dayOffset += 1) {
    const candidateDay = DAYS[(todayIndex + dayOffset) % DAYS.length];
    const schedule = availability.find((entry) => entry.day === candidateDay);
    if (!schedule || parseTime(schedule.openTime) === null) continue;

    const openingMinutes = parseTime(schedule.openTime)!;
    if (dayOffset === 0 && openingMinutes <= minutes) continue;

    const dayLabel =
      dayOffset === 0
        ? "today"
        : dayOffset === 1
          ? "tomorrow"
          : `on ${candidateDay}`;

    return `${dayLabel} at ${formatOpeningTime(schedule.openTime)}`;
  }

  return null;
}

function isOpenAt(
  availability: StoreAvailabilityEntry[],
  date: Date
) {
  const { day, minutes } = getTimeInStoreZone(date);
  const todayIndex = DAYS.indexOf(day);
  const todaySchedule = availability.find((entry) => entry.day === day);

  if (todaySchedule) {
    const openTime = parseTime(todaySchedule.openTime);
    const closeTime = parseTime(todaySchedule.closeTime);

    if (openTime !== null && closeTime !== null) {
      if (closeTime > openTime && minutes >= openTime && minutes < closeTime) {
        return true;
      }

      if (closeTime < openTime && minutes >= openTime) {
        return true;
      }
    }
  }

  const previousDay = DAYS[(todayIndex + DAYS.length - 1) % DAYS.length];
  const previousSchedule = availability.find(
    (entry) => entry.day === previousDay
  );

  if (previousSchedule) {
    const openTime = parseTime(previousSchedule.openTime);
    const closeTime = parseTime(previousSchedule.closeTime);

    if (
      openTime !== null &&
      closeTime !== null &&
      closeTime < openTime &&
      minutes < closeTime
    ) {
      return true;
    }
  }

  return false;
}

export function useStoreAvailability(
  availability?: StoreAvailabilityEntry[]
) {
  const validAvailability = useMemo(
    () =>
      Array.isArray(availability)
        ? availability.filter(
            (entry) =>
              DAYS.includes(entry.day) &&
              timePattern.test(entry.openTime) &&
              timePattern.test(entry.closeTime)
          )
        : [],
    [availability]
  );
  const hasAvailability = validAvailability.length > 0;
  const [isOpen, setIsOpen] = useState(true);
  const [nextOpening, setNextOpening] = useState<string | null>(null);

  useEffect(() => {
    if (!hasAvailability) {
      setIsOpen(true);
      setNextOpening(null);
      return;
    }

    const updateAvailability = () => {
      const now = new Date();
      setIsOpen(isOpenAt(validAvailability, now));
      setNextOpening(getNextOpening(validAvailability, now));
    };

    updateAvailability();
    const intervalId = window.setInterval(updateAvailability, 30_000);

    return () => window.clearInterval(intervalId);
  }, [hasAvailability, validAvailability]);

  return { hasAvailability, isOpen, nextOpening };
}
