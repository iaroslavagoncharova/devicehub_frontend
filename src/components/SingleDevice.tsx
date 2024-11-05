import React from "react";
import { useFetchDevice } from "../hooks/apiHooks";
import { useParams } from "react-router-dom";
import Data from "../views/data";

const SingleDevice: React.FC = () => {
  const { deviceName } = useParams<{ deviceName: string }>();
  const { loading, error } = useFetchDevice(deviceName || "");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
      <div>
        <Data />
      </div>
  );
};

export default SingleDevice;
