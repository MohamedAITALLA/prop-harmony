
// Country and city data for the property form
export interface CountryData {
  name: string;
  code: string;
  cities: string[];
}

export const countryData: CountryData[] = [
  {
    name: "United States",
    code: "US",
    cities: ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco", "Las Vegas", "Seattle", "Boston", "Denver", "Austin"]
  },
  {
    name: "Canada",
    code: "CA",
    cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Quebec City", "Victoria", "Halifax"]
  },
  {
    name: "United Kingdom",
    code: "UK",
    cities: ["London", "Manchester", "Edinburgh", "Birmingham", "Glasgow", "Liverpool", "Bristol", "Leeds", "Oxford", "Cambridge"]
  },
  {
    name: "France",
    code: "FR",
    cities: ["Paris", "Nice", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Strasbourg", "Cannes", "Lille", "Nantes"]
  },
  {
    name: "Spain",
    code: "ES",
    cities: ["Madrid", "Barcelona", "Valencia", "Seville", "Malaga", "Granada", "Bilbao", "Palma", "Ibiza", "San Sebastian"]
  },
  {
    name: "Italy",
    code: "IT",
    cities: ["Rome", "Milan", "Florence", "Venice", "Naples", "Turin", "Bologna", "Verona", "Genoa", "Palermo"]
  },
  {
    name: "Germany",
    code: "DE",
    cities: ["Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Dresden", "Stuttgart", "Düsseldorf", "Leipzig", "Nuremberg"]
  },
  {
    name: "Japan",
    code: "JP",
    cities: ["Tokyo", "Kyoto", "Osaka", "Hiroshima", "Sapporo", "Yokohama", "Nagoya", "Kobe", "Fukuoka", "Okinawa"]
  },
  {
    name: "Australia",
    code: "AU",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Hobart", "Darwin", "Cairns"]
  },
  {
    name: "Mexico",
    code: "MX",
    cities: ["Mexico City", "Cancún", "Guadalajara", "Monterrey", "Playa del Carmen", "Puerto Vallarta", "Tijuana", "Mérida", "Oaxaca", "Tulum"]
  }
];

// Get cities for a specific country
export const getCitiesForCountry = (countryName: string): string[] => {
  const country = countryData.find(c => c.name === countryName);
  return country ? country.cities : [];
};
