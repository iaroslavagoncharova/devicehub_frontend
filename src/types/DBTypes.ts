type Device = {
  name: string;
  deviceClass: string;
  deviceType: string;
  location?: string;
  settings?: string;
  status: string;
};

type DeviceClass = {
  name: string;
  type: Array<string>;
};

type DeviceData = {
  deviceId: number;
  timestamp: Date;
  data: Array<string>;
};

type Ruuvi = {
  data: {
    humidity: number;
    temperature: number;
    pressure: number;
    mac: string;
  };
  timestamp: Date;
};

type Admin = {
  id: number;
  username: string;
  password: string;
  role: string;
};

export type { Device, DeviceClass, DeviceData, Ruuvi, Admin };
