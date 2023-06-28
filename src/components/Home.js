import logo from "../logo.png";
import { useContext } from "react";
import { UserContext } from "../App";

function Home() {
  const user = useContext(UserContext);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to Rocketgram</h1>
        <h3>Check out the links above to navigate through our application </h3>
        <h3>
          {user ? <p>Welcome {user.email}</p> : <p>No user logged in.</p>}
        </h3>
      </header>
    </div>
  );
}

export default Home;
