import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "src/context";

const LoginPage = () => {
  const { emailPasswordLogin } = useContext(AuthContext);

  const history = useHistory();

  const [email, setEmail] = useState<string>("test@test.com");
  const [password, setPassword] = useState<string>("test123");

  const login = () => {
    emailPasswordLogin(email, password).then(() => history.push("/"));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: 200,
      }}
    >
      <div style={{ display: "flex", margin: 5 }}>
        <div style={{ width: 80 }}>Email :</div>

        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ display: "flex", margin: 5 }}>
        <div style={{ width: 80 }}>Password :</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <button style={{ width: "100%" }} onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
