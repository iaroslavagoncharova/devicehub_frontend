import {Link} from "react-router-dom";
import { useFetchDevices } from "../hooks/apiHooks";

const Home = () => {
  const { devices, loading, error } = useFetchDevices();

  // take only four first devices
  const devicesToShow = devices ? devices.slice(0, 4) : [];

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!devices) {
    return <div>No devices found</div>;
  }
  return (
    <div>
      <h2 className="h2-title">Device Hub</h2>
      <hr className="line"></hr>
      <div className="home-container">
        <div className="home-intro">
          {/*<img className="home-img" src="/src/assets/nokia1.jpg" alt="logo" />*/}
          <div className="home-text">
            <h1>Welcome to Device Hub</h1>
            <p>
            The idea of the Device hub project is to develop a control panel that manages IoT devices. 
            The project is part of the Nokian Garage project.
            The project has been made in cooperation with students from Nokia and Metropolia.
            </p>
          </div>
          {/*<img className="home-img" src="/src/assets/nokia-logo.png" alt="logo" />*/}
        </div>
        <img
          className="home-img1"
          src="/src/assets/nokia1.jpg"
          alt="logonokia"
        />
        <img
          className="home-img2"
          src="/src/assets/meta.png"
          alt="logometropolia"
        />
        <div className="home-boxes">
          {devicesToShow.map((device, index) => {
            const starClass = `star${(index % 4) + 1}`;
            return (
              <Link to={`/devices/name/${device.name}`} key={device.name}>
              <div className="box" key={device.name}>
                <div className={`home-iconi ${starClass}`}>
                  <img
                    className="home-star"
                    src="/src/assets/vector.png"
                    alt="star"
                  />
                </div>
                <img
                  className="home-dots"
                  src="/src/assets/dotvertical.png"
                  alt="dots"
                />
                <p>{device.name}</p>
                <p>{device.location}</p>
              </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
