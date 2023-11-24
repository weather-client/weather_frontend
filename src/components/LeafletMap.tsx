"use client";

import L from "leaflet";
import { Component, useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { WeatherStation } from "@/core/schemas";
import moment from "moment";
import { Button } from "@mui/material";
import { StationDetail } from "./StationDetail";

let DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

// Dynamic import of react-leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((module) => module.MapContainer),
  {
    ssr: false, // Disable server-side rendering for this component
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((module) => module.TileLayer),
  {
    ssr: false,
  }
);
const Marker = dynamic(
  () => import("react-leaflet").then((module) => module.Marker),
  {
    ssr: false,
  }
);
const Popup = dynamic(
  () => import("react-leaflet").then((module) => module.Popup),
  {
    ssr: false,
  }
);

class LeafletMap extends Component<
  {
    weatherStations: WeatherStation[] | undefined;
  },
  {
    selectedStation: WeatherStation | undefined;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedStation: undefined,
    };
  }

  render() {
    // L.Marker.prototype.options.icon = DefaultIcon;
    // L.Icon.Default.mergeOptions({
    //   iconUrl: "/images/marker-icon.png",
    //   shadowUrl: "/images/marker-shadow.png",
    // });
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <MapContainer
          center={[52.22983, 21.011734]}
          zoom={6}
          style={{
            width: "100vw",
            height: "100vh",
          }}
          minZoom={3}
          maxZoom={20}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {this.props.weatherStations?.map((station) => {
            return (
              <Marker
                position={[station.location.lat, station.location.lon]}
                key={station.id}
              >
                <Popup>
                  Station #{station.id} <br /> {station.name}
                  <br />
                  Last update: {moment(station.lastUpdate).fromNow()}
                  <div>
                    <b>Air</b>
                    <br />
                    {station.lastWeatherData.data.air.map((air, index) => {
                      return (
                        <div
                          style={{
                            border: "1px solid black",
                            width: "fit-content",
                            padding: "3px",
                            borderRadius: "3px"
                          }}
                          key={station + "-" + index}
                        >
                          T: {air.temperature} °C
                          <br />
                          H: {air.humidity} %
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <b>Wind Speed</b>
                    <br />
                    {station.lastWeatherData.data.windSpeed.map(
                      (windSpeed, index) => {
                        return (
                          <div
                            style={{
                              border: "1px solid black",
                              width: "fit-content",
                              padding: "3px",
                              borderRadius: "3px"
                            }}
                            key={station + "-" + index}
                          >
                            {windSpeed} m/s{" "}
                          </div>
                        );
                      }
                    )}
                  </div>
                  <div>
                    <b>Wind Direction</b>
                    <br />
                    {station.lastWeatherData.data.windDirection.map(
                      (windDirection, index) => {
                        return (
                          <div
                            style={{
                              border: "1px solid black",
                              width: "fit-content",
                              padding: "3px",
                              borderRadius: "3px"
                            }}
                            key={station + "-" + index}
                          >
                            {windDirection}
                          </div>
                        );
                      }
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      this.setState({
                        selectedStation: station,
                      });
                    }}
                  >
                    History
                  </Button>
                  {this.state.selectedStation ? (
                    <StationDetail
                      station={this.state.selectedStation}
                      onClose={() => {
                        this.setState({
                          selectedStation: undefined,
                        });
                      }}
                    />
                  ) : null}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    );
  }
}

export default LeafletMap;
