export type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export interface Location {
  lat: number;
  lon: number;
}

export interface WeatherData {
  data: {
    air: [
      {
        humidity: number;
        temperature: number;
      }
    ];
    windDirection: [WindDirection];
    windSpeed: [number];
  };
  location: Location;
  timestamp: number;
  stationId: string;
  source: string;
}

export interface WeatherStation {
  id: string;
  lastUpdate: number;
  lastWeatherData: WeatherData;
  location: Location;
  name: string;
}
