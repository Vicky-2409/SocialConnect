export function formatDate(dateString: string) {
  // Parse the input date string
  const date = new Date(dateString);

  // Convert to IST (UTC+5:30)
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
  const istDate = new Date(date.getTime() + IST_OFFSET);

  // Get the components of the IST date
  const day = istDate.getUTCDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[istDate.getUTCMonth()];
  const year = istDate.getUTCFullYear().toString().slice(-2);
  let hours = istDate.getUTCHours();
  const minutes = istDate.getUTCMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const formattedDate = `${day} ${month} '${year}, ${hours}:${minutes}${ampm}`;

  return formattedDate;
}

export function formatLastMessage(msg: string) {
  return msg.length > 56 ? `${msg.substring(0, 56)} ...` : msg;
}
