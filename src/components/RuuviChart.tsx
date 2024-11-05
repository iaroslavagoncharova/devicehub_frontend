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
      case "1h":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return timestamp >= new Date(now.getTime() - 60 * 60 * 1000);
        });
        console.log(filteredData);
        break;
      case "1day":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return timestamp >= new Date(now.getTime() - 24 * 60 * 60 * 1000);
        });
        console.log(filteredData);
        break;
      case "1week":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return timestamp >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        });
        console.log(filteredData);
        break;
      case "1month":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp.toLocaleString());
          return (
            timestamp >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          );
        });
        console.log(filteredData);
        break;
      case "1year":
        filteredData = ruuviTagData.filter((ruuvi) => {
          const timestamp = new Date(ruuvi.timestamp);
          return (
            timestamp >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
          );
        });
        console.log(filteredData);
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
        case "1h":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleTimeString("fi-FI", {
              hour: "2-digit",
              minute: "2-digit",
            });
          });
          break;

        case "1day":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleTimeString("fi-FI", {
              hour: "2-digit",
              minute: "2-digit",
            });
          });
          break;
        case "1week":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleDateString("fi-FI", {
              day: "2-digit",
              month: "2-digit",
            });
          });
          break;
        case "1month":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleDateString("fi-FI", {
              day: "2-digit",
              month: "2-digit",
            });
          });
          break;

        case "1year":
          formattedLabels = data.map((data: { timestamp: Date }) => {
            const date = new Date(data.timestamp);
            return date.toLocaleDateString("fi-FI", {
              month: "2-digit",
              year: "numeric",
            });
          });
          console.log(formattedLabels);
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

    console.log(macData);

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
