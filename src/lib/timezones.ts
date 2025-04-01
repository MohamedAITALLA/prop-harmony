
export interface Timezone {
  value: string;
  label: string;
}

// Common timezones
export const timezones: Timezone[] = [
  { value: "America/New_York", label: "(GMT-05:00) Eastern Time - New York" },
  { value: "America/Chicago", label: "(GMT-06:00) Central Time - Chicago" },
  { value: "America/Denver", label: "(GMT-07:00) Mountain Time - Denver" },
  { value: "America/Los_Angeles", label: "(GMT-08:00) Pacific Time - Los Angeles" },
  { value: "America/Anchorage", label: "(GMT-09:00) Alaska Time - Anchorage" },
  { value: "Pacific/Honolulu", label: "(GMT-10:00) Hawaii Time - Honolulu" },
  { value: "America/Phoenix", label: "(GMT-07:00) Arizona - Phoenix" },
  { value: "America/Toronto", label: "(GMT-05:00) Eastern Time - Toronto" },
  { value: "America/Vancouver", label: "(GMT-08:00) Pacific Time - Vancouver" },
  { value: "America/Mexico_City", label: "(GMT-06:00) Mexico City" },
  { value: "America/Sao_Paulo", label: "(GMT-03:00) São Paulo" },
  { value: "Europe/London", label: "(GMT+00:00) London" },
  { value: "Europe/Paris", label: "(GMT+01:00) Paris" },
  { value: "Europe/Berlin", label: "(GMT+01:00) Berlin" },
  { value: "Europe/Rome", label: "(GMT+01:00) Rome" },
  { value: "Europe/Madrid", label: "(GMT+01:00) Madrid" },
  { value: "Europe/Amsterdam", label: "(GMT+01:00) Amsterdam" },
  { value: "Europe/Zurich", label: "(GMT+01:00) Zurich" },
  { value: "Europe/Moscow", label: "(GMT+03:00) Moscow" },
  { value: "Asia/Dubai", label: "(GMT+04:00) Dubai" },
  { value: "Asia/Singapore", label: "(GMT+08:00) Singapore" },
  { value: "Asia/Tokyo", label: "(GMT+09:00) Tokyo" },
  { value: "Asia/Hong_Kong", label: "(GMT+08:00) Hong Kong" },
  { value: "Asia/Seoul", label: "(GMT+09:00) Seoul" },
  { value: "Asia/Shanghai", label: "(GMT+08:00) Shanghai" },
  { value: "Australia/Sydney", label: "(GMT+10:00) Sydney" },
  { value: "Australia/Melbourne", label: "(GMT+10:00) Melbourne" },
  { value: "Pacific/Auckland", label: "(GMT+12:00) Auckland" },
];
