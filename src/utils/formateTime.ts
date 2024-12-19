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
