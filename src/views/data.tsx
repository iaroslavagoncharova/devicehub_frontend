import React from "react";
import "../style/data.css";
import LeftPanel from "../components/LeftPanel";
import RightPanel from "../components/RightPanel";
import { useFetchDevice } from "../hooks/apiHooks";
import { useParams } from "react-router-dom";

const Data: React.FC = () => {
  const { deviceName } = useParams<{ deviceName: string }>();
  const { device, loading, error } = useFetchDevice(deviceName || "");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!device) {
    return;
  }

  return (
    <div className="data-wrapper">
      <h2 className="h2-title">Device Hub</h2>
      <hr className="line" />
      <div className="device-hub-container">
        <div className="content">
          <div className="left-section">
            <h2>{deviceName}</h2>
            <LeftPanel />
          </div>
          <div className="right-section">
            <RightPanel device={device} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
