import React from "react";
import { useFetchDevices } from "../hooks/apiHooks";
import { Link } from "react-router-dom";

const DeviceList: React.FC<{ onDelete: (deviceName: string) => void }> = ({
  onDelete,
}) => {
  const { devices, loading, error } = useFetchDevices();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Devices</h2>
      <ul>
        {devices.map((device) => (
          <li key={device.name}>
            <Link to={`/devices/name/${device.name}`}>
              {device.name} - {device.deviceType} - {device.location}
            </Link>
            <button onClick={() => onDelete(device.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeviceList;
