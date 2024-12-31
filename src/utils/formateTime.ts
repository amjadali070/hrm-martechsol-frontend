export const formatTime = (time?: string) => {
  if (!time) return "N/A";

  const date = new Date(time);
  if (isNaN(date.getTime())) return "Invalid Time";

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinute = minutes.toString().padStart(2, "0");

  return `${formattedHour}:${formattedMinute} ${ampm}`;
};

export const formatAttendenceTicketTime = (time: string): string => {
  if (!time || typeof time !== "string") return "Invalid Time";

  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (
    isNaN(hour) ||
    isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return "Invalid Time";
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
