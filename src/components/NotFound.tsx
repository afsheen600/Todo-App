import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h2>the page u looking for is not found! </h2>
      <Link to="/">go to home</Link>
    </div>
  );
};

export default NotFound;
