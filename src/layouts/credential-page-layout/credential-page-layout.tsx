import { Outlet } from "react-router-dom";
import "./credential-page-layout.css";

const CredentialPageLayout = () => {
  return (
    <div className="flex h-full">
      {/* Left Half: Static Image */}
      <div className="relative w-1/2 xl:block hidden">
        <div
          className="absolute inset-0 bg-black opacity-50 z-10"
          aria-hidden="true"
        ></div>
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/credential-page.jpg')" }}
        ></div>
      </div>
      {/* Right Half: Dynamic Content */}

      <div className="relative xl:w-1/2 w-full flex flex-col items-center justify-center bg-[url('/assets/credential-page.jpg')] xl:bg-[url('/assets/credential-form-bg.jpg')] bg-no-repeat bg-center bg-cover">
        <div className="absolute inset-0 bg-black opacity-50 xl:hidden"></div>

        <div className="relative z-10 w-full md:w-auto p-6 flex justify-center items-center flex-col">
          <h1 className="project-title text-white">Personal Finance Tracker</h1>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CredentialPageLayout;
