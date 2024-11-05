import { Device } from "../types/DBTypes";

// get device of type Device from props
const RightPanel = ({ device }: { device: Device }) => {
  return (
    <div className="right-panel">
      <div className="info-section">
        <h3>Details</h3>
        <ul>
          <li>
            <p>Class: {device.deviceClass}</p>
          </li>
          <li>Device type: {device.deviceType}</li>
          <li>Location: {device.location}</li>
        </ul>
      </div>
    </div>
  );
};

export default RightPanel;
