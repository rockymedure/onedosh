import { useEffect, useState } from "react";

// Current local time formatted like the phone status bar ("9:41") — 12-hour,
// no leading zero, no AM/PM.
export function nowLabel(): string {
  const d = new Date();
  let h = d.getHours() % 12;
  if (h === 0) h = 12;
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

// Live clock that re-renders as the minute rolls over.
export function useClock(): string {
  const [label, setLabel] = useState(nowLabel);
  useEffect(() => {
    const id = setInterval(() => setLabel(nowLabel()), 15000);
    return () => clearInterval(id);
  }, []);
  return label;
}
