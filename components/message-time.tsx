import { useEffect, useState } from "react";

export default function MessageTime({ datetime }: { datetime: Date }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const date = new Date(datetime);
    const formatted = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // This gives AM/PM format
    });
    setTime(formatted);
  }, [datetime]);

  return <span className="text-xs text-gray-500">{time}</span>;
}
