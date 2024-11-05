import React, { useState } from "react";
import RuuviChart from "./RuuviChart";

const Statistic: React.FC = () => {
  const [range, setRange] = useState("1h");
  const [selected, setSelected] = useState("temperature");

  return (
    <div className="statistic">
      <div className="statistic-header">
        <h3>Statistic</h3>
        <select value={selected} className="range-dropdown" onChange={(e) => setSelected(e.target.value)}>
          <option value="temperature">Temperature</option>
          <option value="humidity">Humidity</option>
          <option value="pressure">Pressure</option>
        </select>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="range-dropdown"
        >
          <option value="1h">1 Hour</option>
          <option value="1day">1 Day</option>
          <option value="1week">1 Week</option>
          <option value="1month">1 Month</option>
          <option value="1year">1 Year</option>
        </select>
      </div>
      <RuuviChart range={range} selected={selected} />
    </div>
  );
};

export default Statistic;
