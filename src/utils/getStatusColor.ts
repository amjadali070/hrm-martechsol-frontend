import { TicketStatus } from "../Components/atoms/TicketDetailModal";

// Determine status color and style
export const getStatusStyle = (status: TicketStatus) => {
  switch (status) {
    case "Closed":
      return "text-green-600";
    case "Open":
      return "text-yellow-600";
    case "Rejected":
      return "text-red-600";
    default:
      return "";
  }
};
