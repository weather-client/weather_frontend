import { WeatherData, WeatherStation } from "@/core/schemas";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Component, ReactNode } from "react";
import {
  Firestore,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import moment from "moment";

export class StationDetail extends Component<
  {
    station: WeatherStation;
    onClose: () => void;
  },
  {
    db: Firestore;
    weatherData: WeatherData[] | undefined;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      db: getFirestore(),
      weatherData: undefined,
    };
    let qData = query(
      collection(this.state.db, "weatherData"),
      where("timestamp", ">", Date.now() - 60 * 60 * 24 * 30 * 1000),
      orderBy("timestamp", "desc")
    );
    onSnapshot(qData, (querySnapshot) => {
      let weatherData: WeatherData[] = [];
      querySnapshot.forEach((doc) => {
        weatherData.push(doc.data() as WeatherData);
      });
      this.setState({ weatherData: weatherData });
    });
  }

  render(): ReactNode {
    return (
      <Dialog
        // fullScreen={fullScreen}
        open={true}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Station #" +
            this.props.station.id +
            " - " +
            this.props.station.name}
        </DialogTitle>
        <DialogContent>
          <div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Location</TableCell>

                  <TableCell>Weather</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.weatherData?.map((row: WeatherData) => (
                  <TableRow key={row.timestamp}>
                    <TableCell component="th" scope="row">
                      {moment(row.timestamp).fromNow()}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={
                          "https://www.google.com/maps/search/?api=1&query=" +
                          row.location.lat +
                          "," +
                          row.location.lon
                        }
                        target="_blank"
                      >
                        {row.location.lat}, {row.location.lon}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <b>Air</b>
                        <br />
                        {row.data?.air?.map((air, index) => {
                          return (
                            <div
                              style={{
                                border: "1px solid black",
                                width: "fit-content",
                              }}
                              key={row.timestamp + "-" + index}
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
                        {row.data?.windSpeed?.map(
                          (windSpeed, index) => {
                            return (
                              <div
                                style={{
                                  border: "1px solid black",
                                  width: "fit-content",
                                }}
                                key={row.timestamp + "-" + index}
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
                        {row.data?.windDirection?.map(
                          (windDirection, index) => {
                            return (
                              <div
                                style={{
                                  border: "1px solid black",
                                  width: "fit-content",
                                }}
                                key={row.timestamp + "-" + index}
                              >
                                {windDirection}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
