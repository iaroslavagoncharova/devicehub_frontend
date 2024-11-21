import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useFetchRuuviTagData } from "../hooks/apiHooks";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    fill: boolean;
    backgroundColor: string;
    borderColor: string;
  }[];
};

// accept range and selected as props
const RuuviChart = ({
  range,
  selected,
}: {
  range: string;
  selected: string;
}) => {
  const { ruuviTagData, loading, error } = useFetchRuuviTagData();
  const [data, setData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  function assignMetrics(selected: string) {
    switch (selected) {
      case "temperature":
        return "°C";
      case "humidity":
        return "%";
      case "pressure":
        return "hPa";
      default:
        return "°C";
    }
  }

  useEffect(() => {
    if (loading || error) {
      return;
    }

    if (ruuviTagData.length === 0) {
      console.log("No data available");
      return;
    }

    let filteredData;
    const now = new Date();

    // filter data based on selected range
    switch (range) {
      case "1hour":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return timestamp >= new Date(now.getTime() - 60 * 60 * 1000);
        });
        break;
      case "24hours":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return timestamp >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
        });
        break;
      case "7days":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return timestamp >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        });
        break;
      case "30days":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return (
            timestamp >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          );
        });
        break;
      case "12months":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp);
          return (
            timestamp >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          );
        });
        break;
      default:
        filteredData = ruuviTagData;
        break;
    }

    if (!filteredData || filteredData.length === 0) {
      console.log("No data available for the selected range");
      setData({ labels: [], datasets: [] });
      return;
    }

    const macs = new Set(filteredData.map((ruuvi) => ruuvi.data.mac));
    const macData = Array.from(macs).map((mac) => {
      const data = filteredData.filter((ruuvi) => ruuvi.data.mac === mac);
      return { mac: mac, data: data };
    });

    const formatLabels = (data: { timestamp: Date }[], range: string) => {
      let formattedLabels = [];

      switch (range) {
        case "1hour":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleTimeString("fi-FI", {
              hour: "2-digit",
              minute: "2-digit",
            });
          });
          break;

        case "24hours":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleTimeString("fi-FI", {
              hour: "2-digit",
              minute: "2-digit",
            });
          });
          break;
        case "7days":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleDateString("fi-FI", {
              day: "2-digit",
              month: "2-digit",
            });
          });
          break;
        case "30days":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleDateString("fi-FI", {
              day: "2-digit",
              month: "2-digit",
            });
          });
          break;

        case "12months":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleDateString("fi-FI", {
              month: "2-digit",
              year: "numeric",
            });
          });
          break;

        default:
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleDateString("fi-FI", {
              month: "2-digit",
              day: "2-digit",
            });
          });
          break;
      }

      return formattedLabels;
    };

    const labels = formatLabels(filteredData, range);

    /***********DATA PROCESSING*************/

    // point every 10 minutes for 1 hour
    if (range === "1hour") {
      // 10 minute interval
      const interval = 10 * 60 * 1000;
      // start time is 1 hour ago
      const startTime = new Date(now.getTime() - 60 * 60 * 1000);
      const endTime = now;

      const timePoints: Date[] = [];
      for (
        let time = startTime.getTime();
        time <= endTime.getTime();
        time += interval
      ) {
        timePoints.push(new Date(time));
      }

      const chartData = {
        labels: timePoints.map((time) =>
          time.toLocaleTimeString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
        datasets: macData.map((macItem) => {
          const dataPoints = timePoints.map((timePoint) => {
            const dataInInterval = macItem.data.filter((data) => {
              const timestamp = new Date(data.timestamp);
              return (
                timestamp >= new Date(timePoint.getTime() - interval) &&
                timestamp < timePoint
              );
            });

            if (dataInInterval.length === 0) {
              return 0;
            }

            const average =
              dataInInterval.reduce((sum, data) => {
                switch (selected) {
                  case "temperature":
                    return sum + data.data.temperature;
                  case "humidity":
                    return sum + data.data.humidity;
                  case "pressure":
                    return sum + data.data.pressure;
                  default:
                    return sum + data.data.temperature;
                }
              }, 0) / dataInInterval.length;

            return average;
          });

          return {
            label: "RuuviTag MAC:" + macItem.mac,
            data: dataPoints,
            fill: false,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.1,
          };
        }),
      };

      setData(chartData);
      return;
    }

    // point every 2 hours for 1 day
    if (range === "24hours") {
      // 2 hour interval
      const interval = 2 * 60 * 60 * 1000;
      // start time is 1 day ago
      const startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const endTime = now;

      const timePoints: Date[] = [];
      for (
        let time = startTime.getTime();
        time <= endTime.getTime();
        time += interval
      ) {
        timePoints.push(new Date(time));
      }

      const chartData = {
        labels: timePoints.map((time) =>
          time.toLocaleTimeString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit",
          })
        ),
        datasets: macData.map((macItem) => {
          const dataPoints = timePoints.map((timePoint) => {
            const dataInInterval = macItem.data.filter((data) => {
              const timestamp = new Date(data.timestamp);
              return (
                timestamp >= new Date(timePoint.getTime() - interval) &&
                timestamp < timePoint
              );
            });

            if (dataInInterval.length === 0) {
              return 0;
            }

            const average =
              dataInInterval.reduce((sum, data) => {
                switch (selected) {
                  case "temperature":
                    return sum + data.data.temperature;
                  case "humidity":
                    return sum + data.data.humidity;
                  case "pressure":
                    return sum + data.data.pressure;
                  default:
                    return sum + data.data.temperature;
                }
              }, 0) / dataInInterval.length;

            return average;
          });

          return {
            label: "RuuviTag MAC:" + macItem.mac,
            data: dataPoints,
            fill: false,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.1,
          };
        }),
      };

      setData(chartData);
      return;
    }

    // point every day for 1 week
    if (range === "7days") {
      // 1 day interval
      const interval = 24 * 60 * 60 * 1000;
      // start time is 1 week ago
      const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const endTime = now;

      const timePoints: Date[] = [];
      for (
        let time = startTime.getTime();
        time <= endTime.getTime();
        time += interval
      ) {
        timePoints.push(new Date(time));
      }

      const chartData = {
        labels: timePoints.map((time) =>
          time.toLocaleDateString("fi-FI", {
            day: "2-digit",
            month: "2-digit",
          })
        ),
        datasets: macData
          .map((macItem) => {
            const dataPoints = timePoints.map((timePoint) => {
              const dataInInterval = macItem.data.filter((data) => {
                const timestamp = new Date(data.timestamp);
                return (
                  timestamp >= new Date(timePoint.getTime() - interval) &&
                  timestamp < timePoint
                );
              });

              if (dataInInterval.length === 0) {
                return 0;
              }

              const average =
                dataInInterval.reduce((sum, data) => {
                  switch (selected) {
                    case "temperature":
                      return sum + data.data.temperature;
                    case "humidity":
                      return sum + data.data.humidity;
                    case "pressure":
                      return sum + data.data.pressure;
                    default:
                      return sum + data.data.temperature;
                  }
                }, 0) / dataInInterval.length;

              return average;
            });

            // filter out datasets with all zero values
            if (dataPoints.every((point) => point === 0)) {
              return null;
            }

            return {
              label: "RuuviTag MAC:" + macItem.mac,
              data: dataPoints,
              fill: false,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            };
          })
          .filter((dataset) => dataset !== null),
      };

      setData(chartData);
      return;
    }

    // point every week for 1 month
    if (range === "30days") {
      // 1 week interval
      const interval = 7 * 24 * 60 * 60 * 1000;
      // start time is 1 month ago
      const startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const endTime = now;

      const timePoints: Date[] = [];
      for (
        let time = startTime.getTime();
        time <= endTime.getTime();
        time += interval
      ) {
        timePoints.push(new Date(time));
      }

      const chartData = {
        labels: timePoints.map((time) =>
          time.toLocaleDateString("fi-FI", {
            day: "2-digit",
            month: "2-digit",
          })
        ),
        datasets: macData
          .map((macItem) => {
            const dataPoints = timePoints.map((timePoint) => {
              const dataInInterval = macItem.data.filter((data) => {
                const timestamp = new Date(data.timestamp);
                return (
                  timestamp >= new Date(timePoint.getTime() - interval) &&
                  timestamp < timePoint
                );
              });

              if (dataInInterval.length === 0) {
                return 0;
              }

              const average =
                dataInInterval.reduce((sum, data) => {
                  switch (selected) {
                    case "temperature":
                      return sum + data.data.temperature;
                    case "humidity":
                      return sum + data.data.humidity;
                    case "pressure":
                      return sum + data.data.pressure;
                    default:
                      return sum + data.data.temperature;
                  }
                }, 0) / dataInInterval.length;

              return average;
            });

            // filter out datasets with all zero values
            if (dataPoints.every((point) => point === 0)) {
              return null;
            }

            return {
              label: "RuuviTag MAC:" + macItem.mac,
              data: dataPoints,
              fill: false,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            };
          })
          .filter((dataset) => dataset !== null),
      };

      setData(chartData);
      return;
    }

    // point every month for 1 year
    if (range === "12months") {
      // 1 month interval
      const interval = 30 * 24 * 60 * 60 * 1000;
      // start time is 1 year ago
      const startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      const endTime = now;

      const timePoints: Date[] = [];
      for (
        let time = startTime.getTime();
        time <= endTime.getTime();
        time += interval
      ) {
        timePoints.push(new Date(time));
      }

      const chartData = {
        labels: timePoints.map((time) =>
          time.toLocaleDateString("fi-FI", {
            month: "2-digit",
            year: "numeric",
          })
        ),
        datasets: macData
          .map((macItem) => {
            const dataPoints = timePoints.map((timePoint) => {
              const dataInInterval = macItem.data.filter((data) => {
                const timestamp = new Date(data.timestamp);
                return (
                  timestamp >= new Date(timePoint.getTime() - interval) &&
                  timestamp < timePoint
                );
              });

              if (dataInInterval.length === 0) {
                return 0;
              }

              const average =
                dataInInterval.reduce((sum, data) => {
                  switch (selected) {
                    case "temperature":
                      return sum + data.data.temperature;
                    case "humidity":
                      return sum + data.data.humidity;
                    case "pressure":
                      return sum + data.data.pressure;
                    default:
                      return sum + data.data.temperature;
                  }
                }, 0) / dataInInterval.length;

              return average;
            });

            // filter out datasets with all zero values
            if (dataPoints.every((point) => point === 0)) {
              return null;
            }

            return {
              label: "RuuviTag MAC:" + macItem.mac,
              data: dataPoints,
              fill: false,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            };
          })
          .filter((dataset) => dataset !== null),
      };

      setData(chartData);
      return;
    }

    // set data based on selected value
    const chartData = {
      labels: labels.reverse(),
      datasets: macData.map((macItem) => ({
        label: "RuuviTag MAC:" + macItem.mac,
        data: macItem.data
          .map((data) => {
            switch (selected) {
              case "temperature":
                return data.data.temperature;
              case "humidity":
                return data.data.humidity;
              case "pressure":
                return data.data.pressure;
              default:
                return data.data.temperature;
            }
          })
          .reverse(),
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      })),
    };

    setData(chartData);
  }, [ruuviTagData, loading, error, range, selected]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chart-container">
      <Line
        data={data}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: `${selected.toUpperCase()} data for the last ${range}`,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              title: {
                display: true,
                text: assignMetrics(selected),
              },
              beginAtZero: true,
            },
          },
        }}
        style={{ height: "300px" }}
      />
    </div>
  );
};

export default RuuviChart;
