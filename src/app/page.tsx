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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";

const app = initializeApp({
	apiKey: "AIzaSyBSr9C1M9a7UbyWukJk7MtvjaXiQdg59MQ",
	authDomain: "weather-station-elka.firebaseapp.com",
	databaseURL:
		"https://weather-station-elka-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "weather-station-elka",
	storageBucket: "weather-station-elka.appspot.com",
	messagingSenderId: "306368859932",
	appId: "1:306368859932:web:b66e2bbfd1829a70ff74d9",
});
const db = getFirestore(app);
const q = query(
	collection(db, "weatherData"),
	where("timestamp", ">", Date.now() / 1000 - 60 * 60 * 24)
);

export default function Home() {
	const [weatherData, setWeatherData] = useState<any>(undefined);
	useEffect(() => {
		if (weatherData === undefined) {
			onSnapshot(q, (querySnapshot) => {
				let weatherData: any[] = [];
				querySnapshot.forEach((doc) => {
					weatherData.push(doc.data());
				});
				setWeatherData(weatherData);
			});
		}
	}, [weatherData]);
	console.log(weatherData);
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Timestamp</TableCell>
							<TableCell>StationId</TableCell>
							<TableCell>Weather</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{weatherData?.map((row: any) => (
							<TableRow key={row.timestamp}>
								<TableCell component="th" scope="row">
									{row.timestamp}
								</TableCell>
								<TableCell>{row.stationId}</TableCell>
								<TableCell>{row.records?.map((record: any) => {
                  return (
                    `Wind: ${record.windSpeed} m/s ${record.windDirection}, T: ${record.temperature} °C, H: ${record.humidity} %\n`
                  )
                })}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</main>
	);
}
