"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff } from "lucide-react";
import type { DoseLogWithMedication } from "@/types";

type ReminderControlsProps = {
  doses: DoseLogWithMedication[];
};

type ReminderStatus = "unsupported" | "default" | "granted" | "denied";

export function ReminderControls({ doses }: ReminderControlsProps) {
  const [status, setStatus] = useState<ReminderStatus>("default");
  const timeoutIds = useRef<number[]>([]);

  const reminderDoses = useMemo(
    () =>
      doses.filter((dose) => {
        const scheduledAt = new Date(dose.scheduledFor).getTime();
        return dose.status === "PENDING" && scheduledAt > Date.now();
      }),
    [doses],
  );

  useEffect(() => {
    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    setStatus(Notification.permission);
  }, []);

  useEffect(() => {
    clearScheduledReminders(timeoutIds.current);

    if (status !== "granted") {
      return;
    }

    timeoutIds.current = reminderDoses.map((dose) => {
      const delay = Math.max(new Date(dose.scheduledFor).getTime() - Date.now(), 0);

      return window.setTimeout(() => {
        const notification = new Notification(
          `Time to take ${dose.medication.name}`,
          {
            body: dose.medication.dosage,
            tag: dose.id,
          },
        );

        notification.onclick = () => {
          window.focus();
          window.location.href = "/";
          notification.close();
        };
      }, delay);
    });

    return () => clearScheduledReminders(timeoutIds.current);
  }, [reminderDoses, status]);

  async function enableReminders() {
    if (!("Notification" in window)) {
      setStatus("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    setStatus(permission);
  }

  if (status === "unsupported") {
    return (
      <p className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg px-4 text-[15px] text-text-muted">
        <BellOff size={17} strokeWidth={1.9} aria-hidden="true" />
        Reminders unavailable
      </p>
    );
  }

  if (status === "granted") {
    return (
      <p className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-status-taken-bg px-4 text-[15px] font-medium text-status-taken-text">
        <Bell size={17} strokeWidth={1.9} aria-hidden="true" />
        {reminderDoses.length === 0
          ? "Reminders on"
          : `${reminderDoses.length} reminder${reminderDoses.length === 1 ? "" : "s"} set`}
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="inline-flex min-h-11 items-center gap-2 rounded-full border border-status-missed bg-status-missed-bg px-4 text-[15px] font-medium text-status-missed-text">
        <BellOff size={17} strokeWidth={1.9} aria-hidden="true" />
        Notifications blocked
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void enableReminders()}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-surface px-4 text-[15px] font-medium text-primary transition hover:border-primary-hover hover:text-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface"
    >
      <Bell size={17} strokeWidth={1.9} aria-hidden="true" />
      Enable reminders
    </button>
  );
}

function clearScheduledReminders(timeoutIds: number[]) {
  timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
  timeoutIds.length = 0;
}
