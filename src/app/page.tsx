"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { initializeApp } from "@firebase/app";
import {
  getFirestore,
  onSnapshot,
  query,
  collection,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import LeafletMap from "../components/LeafletMap";
import { WeatherData, WeatherStation } from "@/core/schemas";
import { firebaseConfig } from "@/core/utils";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const qData = query(
  collection(db, "weatherData"),
  where("timestamp", ">", Date.now() / 1000 - 60 * 60 * 24)
);
const qStations = query(collection(db, "weatherStations"));

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData[] | undefined>(
    undefined
  );
  const [weatherStations, setWeatherStations] = useState<
    WeatherStation[] | undefined
  >(undefined);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarValue, setSnackbarValue] = useState("");
  useEffect(() => {
    if (weatherData === undefined) {
      onSnapshot(qData, (querySnapshot) => {
        let weatherData: WeatherData[] = [];
        querySnapshot.forEach((doc) => {
          weatherData.push(doc.data() as WeatherData);
        });
        setWeatherData(weatherData);
      });
    }
  }, [weatherData]);
  useEffect(() => {
    if (weatherStations === undefined) {
      setSnackbarValue("Loading weather stations...");
	  setSnackbarOpen(true);
      onSnapshot(qStations, (querySnapshot) => {
        let weatherStations: WeatherStation[] = [];
        querySnapshot.forEach((doc) => {
          weatherStations.push(doc.data() as WeatherStation);
        });
        setWeatherStations(weatherStations);
		setSnackbarOpen(false);
      });
    }
    console.log(weatherStations);
  }, [weatherStations]);

  return (
    <main className={styles.main}>
      <LeafletMap weatherStations={weatherStations} />
      <Snackbar
        open={snackbarOpen}
        // autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarValue}
        // action={action}
      />
    </main>
  );
}
