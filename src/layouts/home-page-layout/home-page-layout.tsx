import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";

const HomePageLayout = () => {
  return (
    <div className="main-content h-full flex flex-col justify-between">
      <Navbar />

      <div className="main-content mt-16 h-full  ">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePageLayout;
