import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "src/context";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div>Header</div>
      {user == null && (
        <Link to="/login">
          <button>Login</button>
        </Link>
      )}
      {user && <button onClick={() => logout()}>Logout</button>}
    </div>
  );
};

export default Header;
