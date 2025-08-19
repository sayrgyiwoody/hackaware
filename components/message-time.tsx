import { useEffect, useState } from "react";

export default function MessageTime({ timestamp }: { timestamp: Date }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const date = new Date(timestamp);
    const formatted = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // This gives AM/PM format
    });
    setTime(formatted);
  }, [timestamp]);

  return <span className="text-xs text-gray-500">{time}</span>;
}
