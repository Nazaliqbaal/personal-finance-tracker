import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";

const HomePageLayout = () => {
  return (
    <div className="main-content">
      <Navbar />

      <div className="main-content mt-16  ">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePageLayout;
