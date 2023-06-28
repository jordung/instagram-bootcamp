import { useContext } from "react";
import { UserContext } from "../App";
import { Link, useNavigate } from "react-router-dom";

function Navbar(props) {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const logout = () => {
    props.handleSignOut();
    navigate("/login");
  };
  return (
    <div className="links">
      <Link to="/">Home</Link>
      {user.uid && user.accessToken ? null : <Link to="/login">Login</Link>}

      {user.uid && user.accessToken ? (
        <Link to="/messageForm">Message Form</Link>
      ) : null}

      <Link to="/messageList">Message Lists</Link>
      {user.uid && user.accessToken ? (
        <button onClick={logout}>Sign Out</button>
      ) : null}
    </div>
  );
}

export default Navbar;
