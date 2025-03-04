import { Link } from "react-router-dom";
import "./not-found.css";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center gap-5">
      <div className="flex gap-3 flex-col">
        <h1 className="text-4xl font-bold text-white">404</h1>
        <div className="typewriter">
          <div className="slide">
            <i></i>
          </div>
          <div className="paper"></div>
          <div className="keyboard"></div>
        </div>
      </div>

      <p className="text-lg text-gray-600 dark:text-gray-300">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/dashboard"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
